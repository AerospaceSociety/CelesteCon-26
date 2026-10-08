/**
 * Cloudflare Pages Function: /api/health
 * Public health check endpoint with security hardening (no sensitive internal ID leakage).
 */

import { jsonResponse, checkRateLimit, verifyAdminAuth } from './_security.js';

export async function onRequestGet(context) {
  const { request, env = {} } = context;

  // Rate Limiting: 30 health checks per minute per IP
  const rateLimit = checkRateLimit(request, { limit: 30, windowSeconds: 60, prefix: 'health' });
  if (!rateLimit.allowed) {
    return jsonResponse({ error: 'Too Many Requests' }, 429, request, env);
  }

  const isAdmin = await verifyAdminAuth(request, env);
  const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.JOTFORM_SECRET_KEY || env.apiKey;
  const firebaseUrl = env.FIREBASE_DATABASE_URL || env.VITE_FIREBASE_DATABASE_URL;

  // Public safe health payload
  const payload = {
    status: 'healthy',
    conclave: 'CelesteCon 2026',
    vaultActive: true,
    timestamp: new Date().toISOString()
  };

  // Only authorized administrators receive internal infrastructure diagnostic telemetry
  if (isAdmin) {
    payload.diagnostics = {
      jotformConfigured: Boolean(apiKey),
      firebaseConfigured: Boolean(firebaseUrl),
      platform: 'cloudflare-pages-edge'
    };
  }

  return jsonResponse(payload, 200, request, env);
}
