import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.jsx',
    globals: true,
    // Exclude emulator integration tests — run those with: npm run test:integration
    exclude: ['node_modules/**', 'src/test/integration/**'],
  },
})
