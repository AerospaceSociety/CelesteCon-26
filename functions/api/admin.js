/**
 * Cloudflare Pages Function: /api/admin
 * Protected Secretariat Administrative Endpoint
 * Enforces brute-force lockout, rate limiting, Web Crypto password hashing,
 * and constant-time token verification.
 */

import {
  jsonResponse,
  checkRateLimit,
  timingSafeEqual,
  hashString,
  sanitizeText
} from './_security.js';

// Failed attempt lockout tracker in memory
const failedAttempts = new Map();
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function onRequestPost(context) {
  const { request, env = {} } = context;

  const clientIP =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    '127.0.0.1';

  // 1. Check Brute-Force Lockout
  const now = Date.now();
  const attemptRecord = failedAttempts.get(clientIP);

  if (attemptRecord && attemptRecord.count >= LOCKOUT_THRESHOLD) {
    if (now < attemptRecord.lockedUntil) {
      const waitSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1000);
      return jsonResponse(
        {
          error: 'Forbidden',
          message: `Too many failed administrative login attempts. Security lockout active. Retry in ${waitSeconds}s.`
        },
        403,
        request,
        env
      );
    } else {
      // Lockout window expired, reset
      failedAttempts.delete(clientIP);
    }
  }

  // 2. Rate Limiting: Max 5 auth attempts per 2 minutes
  const rateLimit = checkRateLimit(request, { limit: 5, windowSeconds: 120, prefix: 'admin_auth' });
  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        error: 'Too Many Requests',
        message: 'Administrative authentication rate limit exceeded. Please wait.'
      },
      429,
      request,
      env
    );
  }

  try {
    const body = await request.json();
    const providedPasskey = body?.passkey || '';
    const action = sanitizeText(body?.action || 'status', 40);

    const configuredSecret = env.ADMIN_SECRET_KEY || env.SECRET_KEY || 'aeross_c26_secretariat_secure_2026';
    const configuredSalt = env.ADMIN_AUTH_SALT || 'c26_aeross_dpsrkp_salt';

    // Hash provided passkey with SHA-256 and salt for verification
    const hashedInput = await hashString(providedPasskey, configuredSalt);
    const expectedHash = await hashString(configuredSecret, configuredSalt);

    const isMatch = timingSafeEqual(hashedInput, expectedHash);

    if (!isMatch) {
      // Increment failed attempts counter
      const current = failedAttempts.get(clientIP) || { count: 0, lockedUntil: 0 };
      current.count += 1;
      if (current.count >= LOCKOUT_THRESHOLD) {
        current.lockedUntil = now + LOCKOUT_DURATION_MS;
      }
      failedAttempts.set(clientIP, current);

      const attemptsRemaining = Math.max(0, LOCKOUT_THRESHOLD - current.count);
      return jsonResponse(
        {
          authenticated: false,
          error: 'Unauthorized',
          message: 'Invalid administrative passkey.',
          attemptsRemaining
        },
        401,
        request,
        env
      );
    }

    // Reset failed attempts upon successful login
    failedAttempts.delete(clientIP);

    // Issue short-lived session signature token
    const sessionSignature = await hashString(configuredSecret + ':' + clientIP, String(Math.floor(now / 3600000)));

    if (action === 'telemetry') {
      const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.apiKey;
      const firebaseUrl = env.FIREBASE_DATABASE_URL || env.VITE_FIREBASE_DATABASE_URL;

      return jsonResponse(
        {
          authenticated: true,
          sessionToken: sessionSignature,
          conclave: 'CelesteCon 2026 Secretariat Control',
          securityPosture: {
            rateLimitingActive: true,
            corsStrict: true,
            securityHeadersEnforced: true,
            jotformConnected: Boolean(apiKey),
            firebaseConnected: Boolean(firebaseUrl)
          },
          timestamp: new Date().toISOString()
        },
        200,
        request,
        env
      );
    }

    return jsonResponse(
      {
        authenticated: true,
        sessionToken: sessionSignature,
        message: 'Secretariat authorization confirmed.'
      },
      200,
      request,
      env
    );
  } catch {
    return jsonResponse({ error: 'Administrative gateway processing error' }, 500, request, env);
  }
}
