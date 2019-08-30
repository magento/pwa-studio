const AsyncWebpackPlugin = require('../AsyncWebpackPlugin');

const tapPromise = jest.fn();

const compiler = {
    hooks: {
        emit: {
            tapPromise
        }
    }
};

beforeEach(() => {
    process.env.MAGENTO_BACKEND_URL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
    fetch.resetMocks();
});

test('The plugin prototype should have apply function in its Prototype', () => {
    expect(AsyncWebpackPlugin.prototype.hasOwnProperty('apply')).toBeTruthy();
});

test('tapPromise function should be called on compiler hooks', () => {
    const asyncPluginInstance = new AsyncWebpackPlugin(() => {});
    asyncPluginInstance.apply(compiler);

    expect(tapPromise.mock.calls[0][0]).toBe('AsyncWebpackPlugin');
    expect(tapPromise.mock.calls[0][1] instanceof Function).toBeTruthy();
});

test('If a callback is provided while creating the instance, it should be executed when the second parameter of tapPromise is executed', () => {
    const callback = jest.fn();
    const asyncPluginInstance = new AsyncWebpackPlugin(callback);
    asyncPluginInstance.apply(compiler);
    tapPromise.mock.calls[0][1].call();

    expect(callback).toHaveBeenCalledTimes(1);
});

test('If an invalid callback is provided while creating instance, instance creation should fail', () => {
    expect(() => new AsyncWebpackPlugin()).toThrow();
    expect(() => new AsyncWebpackPlugin(null)).toThrow();
});
