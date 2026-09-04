import { defineConfig, devices } from '@playwright/test';

const staticServerPort = Number.parseInt(
  process.env.PLAYWRIGHT_STATIC_PORT ?? '4314',
  10,
);
const staticServerUrl = `http://127.0.0.1:${staticServerPort}`;
const browserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL;

const viewportProjects = [
  { name: 'chromium-width-320', viewport: { width: 320, height: 900 } },
  { name: 'chromium-width-375', viewport: { width: 375, height: 900 } },
  { name: 'chromium-width-768', viewport: { width: 768, height: 1024 } },
  { name: 'chromium-width-1024', viewport: { width: 1024, height: 900 } },
  { name: 'chromium-width-1440', viewport: { width: 1440, height: 1080 } },
];

const chromiumUse = {
  ...devices['Desktop Chrome'],
  browserName: 'chromium' as const,
  ...(browserChannel ? { channel: browserChannel } : {}),
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  timeout: 30_000,
  use: {
    ...chromiumUse,
    baseURL: staticServerUrl,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  webServer: {
    command: `npm run build:content && npm run dev:static -- --port ${staticServerPort} --strictPort`,
    url: staticServerUrl,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
  projects: [
    ...viewportProjects.map((project) => ({
      name: project.name,
      use: { ...chromiumUse, viewport: project.viewport },
    })),
    {
      name: 'chromium-reduced-motion-1024',
      use: {
        ...chromiumUse,
        viewport: { width: 1024, height: 900 },
      },
    },
    {
      name: 'firefox-1024',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
        viewport: { width: 1024, height: 900 },
      },
    },
    {
      name: 'webkit-1024',
      use: {
        ...devices['Desktop Safari'],
        browserName: 'webkit',
        viewport: { width: 1024, height: 900 },
      },
    },
  ],
});
