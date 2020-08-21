const mock = {
    before: jest.fn(),
    after: jest.fn(),
    visitor: {
        'index.js': jest.fn(),
        '**/*.css': jest.fn(),
        'ignoreexp/*': jest.fn()
    }
};

const factory = () => mock;

factory.mock = mock;

module.exports = factory;
