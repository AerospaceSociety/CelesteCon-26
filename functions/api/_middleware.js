import { getCorsHeaders, getSecurityHeaders, checkRateLimit } from './_security.js';

/**
 * Global Cloudflare Pages Functions API Middleware
 * Runs on every /api/* invocation.
 */
export async function onRequest(context) {
  const { request, env, next } = context;

  // 1. Handle CORS Preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    const cors = getCorsHeaders(request, env);
    const sec = getSecurityHeaders();
    return new Response(null, {
      status: 204,
      headers: { ...cors, ...sec }
    });
  }

  // 2. Global Rate Limiter: 100 requests per minute per IP for general API
  const rateLimit = checkRateLimit(request, { limit: 100, windowSeconds: 60, prefix: 'global' });
  if (!rateLimit.allowed) {
    const cors = getCorsHeaders(request, env);
    const sec = getSecurityHeaders();
    return new Response(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait before retrying.',
        retryAfter: rateLimit.retryAfter
      }),
      {
        status: 429,
        headers: {
          ...cors,
          ...sec,
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimit.retryAfter)
        }
      }
    );
  }

  // 3. Request Size Limiter: Block request payloads > 512KB
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > 512 * 1024) {
    const cors = getCorsHeaders(request, env);
    const sec = getSecurityHeaders();
    return new Response(
      JSON.stringify({ error: 'Payload Too Large', message: 'Request body exceeds 512KB limit.' }),
      {
        status: 413,
        headers: { ...cors, ...sec, 'Content-Type': 'application/json' }
      }
    );
  }

  // 4. Execute downstream handler and append security headers
  try {
    const response = await next();

    // Create a new response with merged security headers and CORS
    const headers = new Headers(response.headers);
    const cors = getCorsHeaders(request, env);
    const sec = getSecurityHeaders();

    for (const [key, val] of Object.entries(cors)) {
      headers.set(key, val);
    }
    for (const [key, val] of Object.entries(sec)) {
      headers.set(key, val);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (err) {
    console.error('Unhandled API exception:', err);
    const cors = getCorsHeaders(request, env);
    const sec = getSecurityHeaders();
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'A secure server error occurred. Please retry or contact conclave support.'
      }),
      {
        status: 500,
        headers: { ...cors, ...sec, 'Content-Type': 'application/json' }
      }
    );
  }
}
