const HOMESERVER = 'https://matrix.mychat.ph';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const start = Date.now();
  let matrixStatus = 'ok';
  let matrixLatencyMs = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const r = await fetch(`${HOMESERVER}/_matrix/client/versions`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    matrixLatencyMs = Date.now() - start;
    if (!r.ok) matrixStatus = 'degraded';
  } catch {
    matrixStatus = 'unreachable';
    matrixLatencyMs = Date.now() - start;
  }

  const overall = matrixStatus === 'ok' ? 'ok' : matrixStatus;

  res.status(overall === 'unreachable' ? 503 : 200).json({
    status: overall,
    timestamp: new Date().toISOString(),
    services: {
      matrix: {
        url: HOMESERVER,
        status: matrixStatus,
        latency_ms: matrixLatencyMs,
      },
    },
  });
}
