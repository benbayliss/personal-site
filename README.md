# Ben Bayliss — personal site

[![Quality](https://github.com/benbayliss/personal-site/actions/workflows/quality.yml/badge.svg)](https://github.com/benbayliss/personal-site/actions/workflows/quality.yml)

A small personal site for selected work and occasional writing from San
Francisco. It is built with React, TypeScript, vinext, and Cloudflare Workers.

## Engineering notes

- Production rendering is covered by Node's built-in test runner.
- ESLint includes React, accessibility, and framework-specific checks.
- Every push to `main` is verified in GitHub Actions.
- A scheduled Codex task can run the same checks and record build metrics in
  [`data/build-health.json`](data/build-health.json).

The health ledger is intentionally transparent: its commits use the
`chore(health):` prefix and only contain generated measurements after lint and
tests pass. It is operational telemetry, not hand-authored project work.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run lint
npm test
```

After both checks pass, record a health snapshot with:

```bash
npm run health:record
```

## Project structure

```text
app/       Page, layout, and styles
data/      Generated build-health history
db/        Optional Drizzle schema
scripts/   Maintenance tooling
tests/     Production-rendering tests
worker/    Cloudflare Worker entrypoint
```

The project includes optional Cloudflare D1 and Drizzle support, but the public
site currently has no database dependency.
