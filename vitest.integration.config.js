import { defineConfig } from 'vitest/config';

// Separate Vitest config for integration tests that run against the Firebase Emulator.
// Unit tests continue to use vite.config.js (vi.mock approach, no emulator needed).
//
// Run with:  npm run test:integration
// Requires the emulator running first:  npm run emulators
export default defineConfig({
    test: {
        // Node environment — no DOM needed for direct Firestore integration tests.
        environment: 'node',
        globals: true,
        include: ['src/test/integration/**/*.test.js'],
        // Emulator calls are slower than in-memory mocks — give each test more headroom.
        testTimeout: 15000,
        hookTimeout: 15000,
    },
});
