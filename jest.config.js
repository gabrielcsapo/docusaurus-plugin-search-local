/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  collectCoverage: false, // turned off to clean up test output when running locally, use `--coverage true` to get coverage output
  coverageDirectory: "<rootDir>/.coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
  projects: [
    {
      displayName: "client",
      clearMocks: true,
      moduleNameMapper: {
        "\\.module\\.css$": "identity-obj-proxy",
        "@docusaurus/(browserContext|BrowserOnly|ComponentCreator|constants|docusaurusContext|ExecutionEnvironment|Head|Interpolate|isInternalUrl|Link|Noop|renderRoutes|router|Translate|use.*)":
          "@docusaurus/core/lib/client/exports/$1",
      },
      modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
      testEnvironment: "jsdom",
      testMatch: [
        "<rootDir>/src/client/**/__tests__/**/*.[jt]s?(x)",
        "<rootDir>/src/client/**/?(*.)+(spec|test).[jt]s?(x)",
      ],
      transform: {
        "^.+\\.[t|j]sx?$": "ts-jest",
        "^.+\\.[t|j]s?$": "ts-jest",
      },
      globals: {
        "ts-jest": {
          tsconfig: "tsconfig.client.json",
        },
      },
    },
    {
      displayName: "server",
      clearMocks: true,
      modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
      testEnvironment: "node",
      testMatch: [
        "<rootDir>/src/server/**/__tests__/**/*.[jt]s?(x)",
        "<rootDir>/src/server/**/?(*.)+(spec|test).[jt]s?(x)",
      ],
      transform: {
        "^.+\\.[t|j]sx?$": "ts-jest",
        "^.+\\.[t|j]s?$": "ts-jest",
      },
      globals: {
        "ts-jest": {
          tsconfig: "tsconfig.server.json",
        },
      },
    },
  ],
};
