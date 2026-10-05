/**
 * Cloudflare Pages Function: /api/health
 * Inspects server health and verifies JotForm environment configuration.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.JOTFORM_SECRET_KEY || env.apiKey;
  const formId = env.JOTFORM_FORM_ID || "261896133006456";
  const apiBase = env.JOTFORM_API_BASE || "https://api.jotform.com";

  return new Response(
    JSON.stringify({
      status: "ok",
      platform: "cloudflare-pages",
      jotform_configured: Boolean(apiKey),
      form_id: formId,
      form_url: `https://form.jotform.com/${formId}`,
      api_base: apiBase,
      timestamp: new Date().toISOString()
    }, null, 2),
    {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json"
      }
    }
  );
}
