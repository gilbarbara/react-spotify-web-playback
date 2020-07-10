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
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src', './'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/test/__setup__/setupFiles.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/__setup__/setupTests.ts'],
  snapshotSerializers: ['jest-serializer-html', 'enzyme-to-json/serializer'],
  testMatch: null,
  testRegex: '/test/.*?\\.(test|spec)\\.tsx?$',
  testURL: 'http://localhost:3000/',
  verbose: false,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
