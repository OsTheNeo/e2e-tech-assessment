/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  roots: ["<rootDir>/e2e"],
  testMatch: ["**/*.workflow.ts"],
  globalSetup: "<rootDir>/e2e/setup/globalSetup.ts",
  globalTeardown: "<rootDir>/e2e/setup/globalTeardown.ts",
  setupFilesAfterEnv: ["<rootDir>/e2e/setup/pactum.setup.ts"],
  testTimeout: 60000,
  maxWorkers: 1,
  verbose: true,
};
