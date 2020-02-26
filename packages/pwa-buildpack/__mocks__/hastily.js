const middleware = jest.fn();
const hastily = (module.exports = {
    imageopto: jest.fn().mockReturnValue(middleware),
    hasSupportedExtension: () => true
});
hastily.__mockMiddleware = middleware;
