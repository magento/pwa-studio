const TemplateResolver = require('../TemplateResolver');
const MustacheTemplate = require('../../compiledResources/MustacheTemplate');

test('resolverType is file', () =>
    expect(TemplateResolver.resolverType).toBe('template'));

test('telltale exists', () => expect(TemplateResolver.telltale).toBeDefined());

test('throws if no template specified', async () => {
    await expect(
        new TemplateResolver().resolve({ engine: 'mustache' })
    ).rejects.toThrow('No template specified.');
});

test('throws if no provide arg specified', async () => {
    await expect(
        new TemplateResolver().resolve({
            engine: 'mustache',
            template: './some-template'
        })
    ).rejects.toThrow('Invalid arguments');
});

test('throws if provide arg is invalid', async () => {
    await expect(
        new TemplateResolver().resolve({
            engine: 'mustache',
            template: './some-template',
            provide: [{}]
        })
    ).rejects.toThrow('Invalid arguments');
});

test('throws if template engine is unsupported', async () => {
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    anEngine: 'beard',
                    aTemplate: 'some-template'
                }[dfn[name]])
        ),
        context: {
            get: jest.fn(() => {
                ENV_VAR: 'ENV_VALUE';
            })
        }
    };
    await expect(
        new TemplateResolver(visitor).resolve({
            engine: 'anEngine',
            template: 'aTemplate',
            provide: ['env']
        })
    ).rejects.toThrow(`Template engine 'beard' unsupported`);
    expect(visitor.context.get).toHaveBeenCalledWith('env');
});

test('accepts a template engine instance as the template arg', async () => {
    const io = { readFile() {} };
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    anEngine: 'mustache',
                    aTemplate: new MustacheTemplate('{{ env.ENV_VAR }}', io)
                }[dfn[name]])
        ),
        context: {
            get: jest.fn(() => ({
                ENV_VAR: 'ENV_VALUE'
            }))
        },
        io
    };
    await expect(
        new TemplateResolver(visitor).resolve({
            engine: 'anEngine',
            template: 'aTemplate',
            provide: ['env']
        })
    ).resolves.toEqual('ENV_VALUE');
    expect(visitor.context.get).toHaveBeenCalledWith('env');
});

test('accepts a template string as the template arg', async () => {
    const io = { readFile() {} };
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    anEngine: 'mustache',
                    aTemplate:
                        '{{ env.ENV_VAR }} see the {{#arbitrary}}{{animal}}{{/arbitrary}}'
                }[dfn[name]])
        ),
        context: {
            get: jest.fn(
                name =>
                    ({
                        env: { ENV_VAR: 'come and' },
                        arbitrary: {
                            animal: 'horsie'
                        }
                    }[name])
            )
        },
        io
    };
    await expect(
        new TemplateResolver(visitor).resolve({
            engine: 'anEngine',
            template: 'aTemplate',
            provide: ['env', 'arbitrary']
        })
    ).resolves.toEqual('come and see the horsie');
    expect(visitor.context.get).toHaveBeenCalledWith('env');
});

test('throws if template argument is not an engine instance or a string', async () => {
    const io = { readFile() {} };
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    anEngine: 'mustache',
                    aTemplate: []
                }[dfn[name]])
        ),
        context: {
            get: jest.fn(() => ({
                ENV_VAR: 'ANOTHER_VALUE'
            }))
        },
        io
    };
    await expect(
        new TemplateResolver(visitor).resolve({
            engine: 'anEngine',
            template: 'aTemplate',
            provide: ['env']
        })
    ).rejects.toThrow(
        `Expected string or MustacheTemplate-compatible template and received a foreign object Array!`
    );
});

test('"provide" accepts an object mapping of string => contextValue also', async () => {
    const io = { readFile() {} };
    const visitor = {
        upward: jest.fn(
            async (dfn, name) =>
                ({
                    anEngine: 'mustache',
                    aTemplate:
                        'how {{flavor}} it is to be {{quality}} like you',
                    'env.ENV_VAR': 'sweet',
                    'deep.structure.isNot': 'flat'
                }[dfn[name]])
        ),
        io
    };
    await expect(
        new TemplateResolver(visitor).resolve({
            engine: 'anEngine',
            template: 'aTemplate',
            provide: {
                flavor: 'env.ENV_VAR',
                quality: 'deep.structure.isNot'
            }
        })
    ).resolves.toEqual('how sweet it is to be flat like you');
});

test('throws if "provide" is unrecognized', async () => {
    await expect(
        new TemplateResolver().resolve({
            engine: 'anEngine',
            template: 'aTemplate',
            provide: 54332
        })
    ).rejects.toThrow("Unrecognized 'provide' configuration");
});
