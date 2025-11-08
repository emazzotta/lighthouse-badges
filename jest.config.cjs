module.exports = {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        module: 'ES2022',
        moduleResolution: 'node',
      },
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
  collectCoverage: true,
  coverageReporters: [
    'json',
    'html',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(badge-maker)/)'
  ],
  testMatch: [
    '**/__tests__/**/*.ts',
  ],
  testEnvironment: 'node',
};
