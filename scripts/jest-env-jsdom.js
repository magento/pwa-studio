// Unhandled-exception-logging jsdom environment.
// The `./jest-decorate-env` file returns a function that extends any Jest
// environment class with unhandled rejection handling.
module.exports = require('./jest-decorate-env')(
    require('jest-environment-jsdom')
);
