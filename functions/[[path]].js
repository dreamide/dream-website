const UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

export async function onRequestGet() {
  const upstream = await fetch(UMAMI_SCRIPT_URL, {
    cf: {
      cacheEverything: true,
      cacheTtl: 3600,
    },
  });

  const headers = new Headers(upstream.headers);
  headers.set("content-type", "application/javascript; charset=utf-8");
  headers.set("cache-control", "public, max-age=3600");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
