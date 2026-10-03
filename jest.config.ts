import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

export default config;
