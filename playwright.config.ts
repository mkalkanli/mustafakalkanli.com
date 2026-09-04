import { defineConfig, devices } from '@playwright/test';

const browserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL ?? 'chrome';

const viewportProjects = [
  { name: 'width-320', viewport: { width: 320, height: 900 } },
  { name: 'width-375', viewport: { width: 375, height: 900 } },
  { name: 'width-768', viewport: { width: 768, height: 1024 } },
  { name: 'width-1024', viewport: { width: 1024, height: 900 } },
  { name: 'width-1440', viewport: { width: 1440, height: 1080 } },
];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  timeout: 30_000,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4173',
    channel: browserChannel,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  webServer: {
    command: 'npm run build:content && npm run dev:static',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
  projects: [
    ...viewportProjects.map((project) => ({
      name: project.name,
      use: { viewport: project.viewport },
    })),
    {
      name: 'reduced-motion-1024',
      use: {
        viewport: { width: 1024, height: 900 },
      },
    },
  ],
});
