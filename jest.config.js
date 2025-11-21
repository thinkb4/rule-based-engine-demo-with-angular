module.exports = {
  verbose: true,
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // using alias for src directory
    '^src/(.*)$': '<rootDir>/src/$1', // direct mapping for src directory
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@ionic/core|@stencil/core|ionicons)',
  ],
  testPathIgnorePatterns: [ // do not collect tests here
  ],
  modulePathIgnorePatterns: [ // prevent accidental imports in tests
  ],
  transform: {
    '^.+\\.(html)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: [
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
