const preset = require('../');

const babelConfigApi = {
    env: jest.fn().mockName('api.env')
};

const findBabelModule = (list, module) =>
    list.find(item => {
        const moduleName = Array.isArray(item) ? item[0] : item;
        return moduleName === module;
    });

const pluginsAndPresets = {
    plugins: [],
    presets: []
};

beforeEach(() => babelConfigApi.env.mockReset());

test('returns dev config if api.env() returns nil', () => {
    babelConfigApi.mockReturnValueOnce(undefined);
    expect(config).toMatchObject(pluginsAndPresets);
    expect(findBabelModule(config.presets, '@babel/preset-env')).toBeTruthy();
    expect(babelConfigApi.env).toHaveBeenCalled();
});

test('returns dev config if api.env() returns "development"', () => {
    babelConfigApi.mockReturnValueOnce('development');
    expect(config).toMatchObject(pluginsAndPresets);
    expect(findBabelModule(config.presets, '@babel/preset-env')).toBeTruthy();
    expect(babelConfigApi.env).toHaveBeenCalled();
});

test('accepts options', () => {
    babelConfigApi.mockReturnValueOnce(undefined);
    const config = preset(babelConfigApi, {
        targets: {
            dev: 'Nokia WAP'
        }
    });
    const presetEnv = findBabelModule(config.presets, '@babel/preset-env');
    expect(presetEnv[1].targets).toBe('Nokia WAP');
    expect(babelConfigApi.env).toHaveBeenCalled();
});

test('returns test config if api.env() returns "test"', () => {
    babelConfigApi.mockReturnValueOnce('test');
    expect(config).toMatchObject(pluginsAndPresets);
    expect(
        findBabelModule(config.plugins, 'babel-plugin-dynamic-import-node')
    ).toBeTruthy();
    expect(babelConfigApi.env).toHaveBeenCalled();
});

test('returns production config if api.env() returns "production"', () => {
    babelConfigApi.mockReturnValueOnce('production');
    const config = preset(babelConfigApi);
    expect(config).toMatchObject(pluginsAndPresets);
    expect(
        findBabelModule(config.plugins, '@babel/plugin-transform-runtime')
    ).toBeTruthy();
    expect(findBabelModule(config.presets, '@babel/preset-env')).toBeTruthy();
    expect(babelConfigApi.env).toHaveBeenCalled();
});
