const scenario = process.argv[2];
const baseUrl = process.env.PORTAL_URL || "http://127.0.0.1:30080";
const target = new URL("/api/health", baseUrl);

if (!new Set(["localhost", "127.0.0.1", "::1"]).has(target.hostname)) {
  throw new Error("Load test target must be localhost; public hosts are refused.");
}

if (scenario === "baseline") {
  console.log("Baseline scenario: no requests sent. Observe the Grafana dashboard before generating traffic.");
  process.exit(0);
}

const scenarios = {
  small: { concurrency: 5, requests: 150 },
  many: { concurrency: 25, requests: 500 }
};
const config = scenarios[scenario];
if (!config) {
  console.error("Usage: node k8s/load-test.mjs <baseline|small|many>");
  process.exit(2);
}

let nextRequest = 0;
let succeeded = 0;
let failed = 0;
const startedAt = Date.now();
const workers = Array.from({ length: config.concurrency }, async () => {
  while (nextRequest < config.requests) {
    nextRequest += 1;
    try {
      const response = await fetch(target, { signal: AbortSignal.timeout(5000) });
      await response.arrayBuffer();
      if (response.ok) succeeded += 1;
      else failed += 1;
    } catch {
      failed += 1;
    }
  }
});

await Promise.all(workers);
console.log(JSON.stringify({
  scenario,
  endpoint: target.toString(),
  concurrency: config.concurrency,
  requests: config.requests,
  succeeded,
  failed,
  durationSeconds: Number(((Date.now() - startedAt) / 1000).toFixed(2))
}, null, 2));
if (failed) process.exitCode = 1;
