module.exports = {
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '.*': 'babel-jest',
    '\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  transformIgnorePatterns: ['node_modules/(?!venia-ui|(?!venia-concept))'],
  setupFiles: ['./jest.setup.js'],
  clearMocks: true,
};
