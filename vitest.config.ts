import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'server/**/*.test.ts',
    ],
    exclude: ['node_modules', 'server/dist', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/utils/**/*.ts',
        'server/src/**/*.ts',
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        'server/src/index.ts',
        'server/src/app.ts',
        'server/src/types/**',
      ],
    },
  },
});
