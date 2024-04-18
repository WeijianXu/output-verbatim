/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'babel',

  // collectCoverage: true,
  // collectCoverageFrom: ['**/*.{js,vue}', '!**/node_modules/**'],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
    // "node"
    // 'vue',
  ],

  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom-fifteen', // 'jsdom', //

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: ['(/__tests__/.*|(\\.|/)test)\\.(jsx?|tsx?)$'],

  // A map from regular expressions to paths to transformers
  transform: {
    // 用 `ts-jest` 处理 `*.ts` 文件
    '^.+\\.tsx?$': 'ts-jest',
    // 用 `vue-jest` 处理 `*.vue` 文件
    // '.*\\.(vue)$': 'vue-jest',
  },

  // support the same @ -> src alias mapping in source code
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // 处理静态文件
    // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    //   '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },

  // 处理颜色
  // setupFilesAfterEnv: ['jest-color'],
};
