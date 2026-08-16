import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the personal site and its metadata", async () => {
  const response = await render();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Ben Bayliss<\/title>/i);
  assert.match(
    html,
    /<meta(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']Work and writing from San Francisco\.["'])[^>]*>/i,
  );
  assert.match(html, /<main>/i);
  assert.match(html, /aria-label=["']Primary navigation["']/i);
  assert.match(html, /id=["']about["']/i);
  assert.match(html, /id=["']work["']/i);
  assert.match(html, /id=["']writing["']/i);
});

test("renders the public content without leaking private placeholders", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /A person walking down a foggy San Francisco street/i);
  assert.match(html, /Living in San Francisco/i);
  assert.match(html, /Working at an early-stage company/i);
  assert.match(html, /Things I(?:’|&rsquo;|&#x27;)m learning/i);
  assert.doesNotMatch(html, /oai-authenticated-user-(?:id|email|full-name)/i);
  assert.doesNotMatch(html, /(?:api[_-]?key|secret|password)\s*[:=]/i);
});
