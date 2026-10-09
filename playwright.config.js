import { defineConfig, devices } from '@playwright/test';

// Runs against the production build (`vite preview`) on a phone viewport.
// Browser: `npx playwright install chromium`, or point PLAYWRIGHT_CHROMIUM_PATH at an installed Chromium.
export default defineConfig({
    testDir: 'tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        ...devices['Pixel 7'],
        baseURL: 'http://localhost:4173',
        trace: 'retain-on-failure',
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {}
    },
    webServer: {
        command: 'npx vite preview --port 4173 --strictPort',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI
    }
});
