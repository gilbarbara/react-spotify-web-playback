import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    include: ['test/**/*.spec.ts?(x)'],
    coverage: {
      all: true,
      include: ['src/**/*.ts?(x)'],
      exclude: [
        'src/components/icons/DevicesMobile.tsx',
        'src/components/icons/DevicesSpeaker.tsx',
      ],
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/__setup__/vitest.setup.ts'],
  },
});
