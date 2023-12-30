import type {Config} from 'jest';

const config: Config = {
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
//  roots: ['<rootDir>/test'],
  roots: ['<rootDir>/test/integration/shared'],
  //testMatch: ['**/*.test.ts'],
  testMatch: ['**/get-set-delete.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testTimeout: 120000,
  reporters: ["jest-ci-spec-reporter"]
};

export default config;
