import fs from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// `vite preview` happily serves 404s from a missing folder; fail early with a hint instead.
for (const dir of ['dist', 'dist-teen']) {
    if (!fs.existsSync(`${dir}/index.html`)) throw new Error(`${dir}/ is missing – run \`npm run check\` (or build and build:teen) first.`);
}

// Runs against the production builds of both editions (`vite preview`) on a phone viewport.
// Browser: `npx playwright install chromium`, or point PLAYWRIGHT_CHROMIUM_PATH at an installed Chromium.
export default defineConfig({
    testDir: 'tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        ...devices['Pixel 7'],
        trace: 'retain-on-failure',
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {}
    },
    // One project per edition (docs/editions.md): `npm run build` → dist, `npm run build:teen` → dist-teen.
    projects: [
        { name: 'full', testIgnore: /teen\.spec/, use: { baseURL: 'http://localhost:4173' } },
        { name: 'teen', testMatch: /teen\.spec/, use: { baseURL: 'http://localhost:4174' } }
    ],
    webServer: [
        {
            command: 'npx vite preview --port 4173 --strictPort',
            url: 'http://localhost:4173',
            reuseExistingServer: !process.env.CI
        },
        {
            command: 'npx vite preview --mode teen --outDir dist-teen --port 4174 --strictPort',
            url: 'http://localhost:4174',
            reuseExistingServer: !process.env.CI
        }
    ]
});
