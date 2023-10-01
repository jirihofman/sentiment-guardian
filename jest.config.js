export default {
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
    // The directory where Jest should output its coverage files
    coverageDirectory: 'jest-coverage',
    setupFilesAfterEnv: ['./jest.setup.js'],
    // Thanks: https://stackoverflow.com/questions/60372790/node-v13-jest-es6-native-support-for-modules-without-babel-or-esm/61653104#comment116654281_61653104
    // testEnvironment: 'node',
    testEnvironment: 'jest-environment-node',
    testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
};
