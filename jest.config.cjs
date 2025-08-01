module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,mjs}',
  ],
  collectCoverage: true,
  coverageReporters: [
    'json',
    'html',
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!badge-maker)/'
  ],
};
