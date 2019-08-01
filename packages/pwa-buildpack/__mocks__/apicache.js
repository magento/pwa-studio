const middleware = jest.fn();
module.exports = {
    middleware: jest.fn().mockReturnValue(middleware),
    __mockMiddleware: middleware
};
