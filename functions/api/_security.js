/* eslint-disable no-control-regex */
/**
 * Cloudflare Pages API Security & Hardening Core
 * Implements OWASP Top 10 defenses:
 * - Strict CORS origin validation
 * - Dynamic edge rate limiting
 * - Security response headers
 * - Input sanitization & XSS filter
 * - SSRF & safe URL filtering
 * - Constant-time timing-safe comparisons
 * - Web Crypto SHA-256 password/token hashing
 * - PII masking & safe error formatting
 */

const DEFAULT_ALLOWED_ORIGINS = [
  'https://celestecon.com',
  'https://www.celestecon.com',
  'https://aeross.org',
  'https://www.aeross.org'
];

// Sliding window memory store for rate limiting at edge node
const rateLimitStore = new Map();
const RATE_LIMIT_PURGE_INTERVAL_MS = 60000;
let lastPurge = Date.now();

function purgeExpiredBuckets() {
  const now = Date.now();
  if (now - lastPurge < RATE_LIMIT_PURGE_INTERVAL_MS) return;
  lastPurge = now;
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Validates request origin against allowed list and returns safe CORS headers.
 */
export function getCorsHeaders(request, env = {}) {
  const origin = request.headers.get('Origin') || '';
  const customAllowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const allowedList = [...DEFAULT_ALLOWED_ORIGINS, ...customAllowed];

  let isAllowed = false;
  if (!origin) {
    // Same-origin or non-browser request
    isAllowed = true;
  } else {
    const originLower = origin.toLowerCase();
    // Allow configured production domains
    if (allowedList.includes(originLower)) {
      isAllowed = true;
    }
    // Allow Cloudflare Pages preview URLs (*.pages.dev)
    else if (/^https:\/\/[a-z0-9_-]+\.pages\.dev$/i.test(originLower)) {
      isAllowed = true;
    }
    // Allow local development ports if non-production
    else if (
      env.NODE_ENV !== 'production' &&
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(originLower)
    ) {
      isAllowed = true;
    }
  }

  const allowedOriginHeader = isAllowed && origin ? origin : allowedList[0] || 'https://celestecon.com';

  return {
    'Access-Control-Allow-Origin': allowedOriginHeader,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

/**
 * Standard HTTP security headers for all API responses.
 */
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
  };
}

/**
 * Helper to build JSON responses with security & CORS headers.
 */
export function jsonResponse(data, status = 200, request = null, env = {}) {
  const cors = request ? getCorsHeaders(request, env) : {};
  const sec = getSecurityHeaders();
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      ...sec,
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

/**
 * Rate limiter: tracks client requests per IP over windowSeconds.
 */
export function checkRateLimit(request, { limit = 20, windowSeconds = 60, prefix = 'api' } = {}) {
  purgeExpiredBuckets();

  const clientIP =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    '127.0.0.1';

  const key = `${prefix}:${clientIP}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  record.count += 1;
  if (record.count > limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, retryAfter)
    };
  }

  return { allowed: true, remaining: limit - record.count };
}

/**
 * Input sanitizer: strips control characters, HTML tags, and enforces max length.
 */
export function sanitizeText(val, maxLen = 500) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // remove control chars
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .trim()
    .slice(0, maxLen);
}

/**
 * Strict URL validator to protect against SSRF and open redirect exploits.
 */
export function sanitizeUrl(val, maxLen = 2000) {
  if (typeof val !== 'string') return '';
  const clean = val.trim().slice(0, maxLen);

  try {
    const parsed = new URL(clean);
    // Protocol must strictly be HTTPS or HTTP (preferably HTTPS)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return '';
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost, link-local, loopback, private ranges (SSRF defense)
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '169.254.169.254' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    ) {
      return '';
    }

    return parsed.href;
  } catch {
    return '';
  }
}

/**
 * Timing-safe string comparison to protect against timing attacks.
 */
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Hashes a string using Web Crypto SHA-256 with optional salt.
 */
export async function hashString(value, salt = '') {
  const encoder = new TextEncoder();
  const data = encoder.encode(value + ':' + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Mask email to prevent PII exposure in public verification checks.
 */
export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const parts = email.trim().split('@');
  if (parts.length !== 2) return '';
  const [user, domain] = parts;
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

/**
 * Mask phone number for privacy preservation.
 */
export function maskPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const clean = phone.replace(/[^\d+]/g, '');
  if (clean.length < 5) return '***';
  return clean.slice(0, 3) + ' ***** ' + clean.slice(-3);
}

/**
 * Validate admin authorization token against secret.
 */
export async function verifyAdminAuth(request, env = {}) {
  const adminSecret = env.ADMIN_SECRET_KEY || env.SECRET_KEY || '';
  if (!adminSecret) return false;

  const authHeader = request.headers.get('Authorization') || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const url = new URL(request.url);
    token = url.searchParams.get('adminToken') || '';
  }

  if (!token) return false;

  return timingSafeEqual(token, adminSecret);
}
