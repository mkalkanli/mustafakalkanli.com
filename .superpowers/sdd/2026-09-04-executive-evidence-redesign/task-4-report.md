# Task 4 Report

Date: 2026-09-04
Status: Complete

## Scope Delivered

- Added reproducible Playwright scripts:
  - `npm run test:e2e`
  - `npm run test:e2e:install`
- Installed only the required Playwright browser set for this task: Chromium, Firefox, and WebKit.
- Added Playwright configuration for the static advisory surface at `http://127.0.0.1:4314`.
- Added browser quality gates for:
  - Turkish-only rendered surface
  - `noindex, nofollow, noarchive`
  - visible `Adli Bilişim` section
  - `mailto:` consultation CTA
  - keyboard focus and skip-link flow
  - reduced-motion usability with computed transition and animation duration checks
  - horizontal overflow at 320, 375, 768, 1024, and 1440 widths
- Made the browser setup reproducible by:
  - switching default execution to bundled Playwright Chromium instead of the system Chrome channel
  - allowing an explicit browser channel override only via `PLAYWRIGHT_BROWSER_CHANNEL`
  - forcing `reuseExistingServer: false`
  - using a task-specific Playwright server port (`4314`)
  - adding Firefox and WebKit engine projects alongside the Chromium width matrix

## Verification

- `npm test` -> PASS
- `npm run lint` -> PASS
- `npm run build:static` -> PASS
- `npm run test:e2e -- --project=chromium-reduced-motion-1024` -> PASS (`4 passed`)
- `npm run test:e2e -- --project=webkit-1024 -g "keyboard navigation"` -> PASS (`1 passed`)
- `npm run test:e2e` -> PASS (`25 passed, 7 skipped`)

## Self Review

- The E2E setup is now deterministic inside the worktree: dedicated port, fresh local server per run, local browser binaries, and explicit engine coverage.
- The reduced-motion gate now checks computed durations directly instead of relying only on visibility.
- WebKit keyboard navigation needed Safari-style `Option+Tab` stepping in the test harness; that keeps the assertion keyboard-driven while matching engine behavior.

## Concerns

- Playwright requires localhost server startup, so E2E verification depends on an unsandboxed run in this environment.
