/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: false, // turned off to clean up test output when running locally, use `--coverage true` to get coverage output
  coverageDirectory: "<rootDir>/.coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
  moduleNameMapper: {
    "\\.module\\.css$": "identity-obj-proxy",
  },
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
};
