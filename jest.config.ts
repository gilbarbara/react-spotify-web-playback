module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/__setup__/setupFilesAfterEnv.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    resources: 'usable',
    url: 'http://localhost:3000/',
  },
  testRegex: '/test/.*?\\.(test|spec)\\.tsx?$',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'test/tsconfig.json',
        diagnostics: {
          ignoreCodes: ['TS151001'],
        },
      },
    ],
  },
  verbose: false,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
