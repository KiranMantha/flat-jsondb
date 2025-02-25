export default {
  displayName: 'FLAT-JSONDB',
  testMatch: ['<rootDir>/__tests__/*.spec.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash'
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html']
};
