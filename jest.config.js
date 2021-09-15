module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/.coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
  moduleNameMapper: {
    "\\.module\\.css$": "identity-obj-proxy",
  },
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
};
