import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

// Optional: run against an already-installed Chromium instead of Playwright's download.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: { name: 'unit', include: ['src/**/*.test.ts'], environment: 'node' },
      },
      {
        // Component tests run in a real browser: the bookshelf measures layout, which jsdom can't do.
        extends: true,
        test: {
          name: 'component',
          include: ['src/**/*.test.tsx'],
          browser: {
            enabled: true,
            headless: true,
            // Reduced motion makes the open/close sequence instant, so tests don't wait on animations.
            provider: playwright({ launchOptions: { executablePath }, contextOptions: { reducedMotion: 'reduce' } }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
