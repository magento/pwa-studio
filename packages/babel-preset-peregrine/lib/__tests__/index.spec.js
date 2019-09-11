const preset = require('../');

const env = jest.fn().mockName('api.env');

const findBabelModule = (list, module) =>
    list.find(item => {
        const moduleName = Array.isArray(item) ? item[0] : item;
        return moduleName === module;
    });

const pluginsAndPresets = {
    plugins: expect.any(Array),
    presets: expect.any(Array)
};

beforeEach(() => env.mockReset());

test('returns dev config if api.env() returns nil', () => {
    env.mockReturnValueOnce(undefined);
    const config = preset({ env });
    expect(config).toMatchObject(pluginsAndPresets);
    expect(findBabelModule(config.presets, '@babel/preset-env')).toBeTruthy();
    expect(env).toHaveBeenCalled();
});

test('returns dev config if api.env() returns "development"', () => {
    env.mockReturnValueOnce('development');
    const config = preset({ env });
    expect(config).toMatchObject(pluginsAndPresets);
    expect(findBabelModule(config.presets, '@babel/preset-env')).toBeTruthy();
    expect(env).toHaveBeenCalled();
});

test('accepts options', () => {
    env.mockReturnValueOnce(undefined);
    const config = preset(
        { env },
        {
            targets: {
                dev: 'Nokia WAP'
            }
        }
    );
    const presetEnv = findBabelModule(config.presets, '@babel/preset-env');
    expect(presetEnv[1].targets).toBe('Nokia WAP');
    expect(env).toHaveBeenCalled();
});

test('returns test config if api.env() returns "test"', () => {
    env.mockReturnValueOnce('test');
    const config = preset({ env });
    expect(config).toMatchObject(pluginsAndPresets);
    expect(
        findBabelModule(config.plugins, 'babel-plugin-dynamic-import-node')
    ).toBeTruthy();
    expect(env).toHaveBeenCalled();
});

test('returns production config if api.env() returns "production"', () => {
    env.mockReturnValueOnce('production');
    const config = preset({ env });
    expect(config).toMatchObject(pluginsAndPresets);
    expect(
        findBabelModule(config.plugins, '@babel/plugin-transform-runtime')
    ).toBeTruthy();
    expect(findBabelModule(config.presets, '@babel/preset-env')).toBeTruthy();
    expect(env).toHaveBeenCalled();
});
