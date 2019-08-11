const middleware = jest.fn();
const expressSharp = (module.exports = jest.fn().mockReturnValue(middleware));
expressSharp.__mockMiddleware = middleware;
