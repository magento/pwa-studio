const plugin = require('../index');

const fs = require('fs');
const eslint = require('eslint');
const glob = require('glob');

jest.mock('fs');
jest.mock('eslint');
jest.mock('glob');

test('it exports the correct command name', () => {
    expect(plugin.command).toBe('validate-magento-pwa-queries');
});

test('it exports a description', () => {
    expect(plugin.desc).toBeTruthy();
});

describe('supportedArguments', () => {
    test('it supports a project command line argument', () => {
        const keys = Object.keys(plugin.supportedArguments);

        expect(keys).toHaveLength(1);
        expect(keys).toContain('project');
    });
});

describe('builder', () => {
    const mockArgs = {
        options: jest.fn()
    };
    afterEach(() => {
        mockArgs.options.mockClear();
    });

    test('it is a function', () => {
        expect(plugin.builder).toBeInstanceOf(Function);
    });

    test('it calls args.options with the correct supported arguments', () => {
        plugin.builder(mockArgs);

        expect(mockArgs.options).toHaveBeenCalled();
        expect(mockArgs.options).toHaveBeenCalledWith(
            plugin.supportedArguments
        );
    });
});

describe('handler', () => {
    const mockArgs = {
        project: 'myApp'
    };
    const getProjectConfig = jest.fn().mockResolvedValue({
        config: {
            extensions: {
                'validate-magento-pwa-queries': {
                    clients: ['apollo', 'literal'],
                    filesGlob: '*.graphql',
                    ignore: ['*.js'],
                    magentoBackendEdition: 'MOS',
                    mosFilesGlob: 'mosFilesGlob',
                    ceFilesGlob: 'ceFilesGlob',
                    acFilesGlob: 'acFilesGlob',
                    eeFilesGlob: 'eeFilesGlob'
                }
            },
            schemaPath: 'unit test'
        }
    });

    const mockContext = {
        getProjectConfig,
        spinner: {
            fail: jest.fn(),
            start: jest.fn(),
            succeed: jest.fn()
        }
    };

    let eslintCLIEngineSpy;
    let existsSyncSpy;
    let mockConsoleLog;
    let mockConsoleWarn;
    let mockProcessExit;
    let globSyncSpy;

    beforeAll(() => {
        const noop = () => {};

        // For happy paths, mock a report that indicates no errors.
        eslintCLIEngineSpy = jest.spyOn(eslint, 'CLIEngine');
        eslintCLIEngineSpy.mockImplementation(() => ({
            executeOnFiles: jest.fn().mockImplementation(() => ({
                errorCount: 0,
                results: {
                    length: Number.POSITIVE_INFINITY
                }
            })),
            resolveFileGlobPatterns: jest.fn()
        }));

        globSyncSpy = jest.spyOn(glob, 'sync');
        globSyncSpy.mockImplementation(() => []);

        // For happy paths, mock the file existing.
        existsSyncSpy = jest.spyOn(fs, 'existsSync');
        existsSyncSpy.mockImplementation(() => true);

        mockConsoleLog = jest.spyOn(console, 'log');
        mockConsoleLog.mockImplementation(noop);

        mockConsoleWarn = jest.spyOn(console, 'warn');
        mockConsoleWarn.mockImplementation(noop);

        mockProcessExit = jest.spyOn(process, 'exit');
        mockProcessExit.mockImplementation(noop);
    });
    afterEach(() => {
        eslintCLIEngineSpy.mockClear();
        existsSyncSpy.mockClear();
        mockConsoleLog.mockClear();
        mockConsoleWarn.mockClear();
        mockProcessExit.mockClear();
    });
    afterAll(() => {
        eslintCLIEngineSpy.mockRestore();
        existsSyncSpy.mockRestore();
        mockConsoleLog.mockRestore();
        mockConsoleWarn.mockRestore();
        mockProcessExit.mockRestore();
    });

    test('it is a function', () => {
        expect(plugin.handler).toBeInstanceOf(Function);
    });

    test('it returns undefined', async () => {
        const actual = await plugin.handler(mockContext, mockArgs);

        expect(actual).toBeUndefined();
    });

    test("it throws if the schema doesn't exist locally", async () => {
        // Mock the file not existing.
        existsSyncSpy.mockImplementationOnce(() => false);

        await plugin.handler(mockContext, mockArgs);

        expect(existsSyncSpy).toHaveBeenCalled();
        expect(mockContext.spinner.fail).toHaveBeenCalled();
        expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    test('it creates a validator with the correct configuration', async () => {
        // Act.
        await plugin.handler(mockContext, mockArgs);

        // Assert.
        const ruleTargets = [
            // These objects are derived from mockArgs.
            {
                env: 'apollo',
                projectName: 'myApp',
                schemaJsonFilepath: 'unit test'
            },
            {
                env: 'literal',
                projectName: 'myApp',
                schemaJsonFilepath: 'unit test'
            }
        ];
        const warnRule = ['warn', ...ruleTargets];

        const lintConfiguration = eslintCLIEngineSpy.mock.calls[0][0];

        const keys = Object.keys(lintConfiguration);
        expect(keys).toHaveLength(4);
        expect(keys).toContain('parser');
        expect(keys).toContain('plugins');
        expect(keys).toContain('rules');
        expect(keys).toContain('useEslintrc');

        expect(lintConfiguration.parser).toBe('babel-eslint');

        expect(lintConfiguration.plugins).toHaveLength(1);
        expect(lintConfiguration.plugins).toContain('graphql');

        const rulesKeys = Object.keys(lintConfiguration.rules);
        expect(rulesKeys).toHaveLength(5);
        expect(rulesKeys).toContain('graphql/template-strings');
        expect(rulesKeys).toContain('graphql/no-deprecated-fields');

        const templateStringsRule =
            lintConfiguration.rules['graphql/template-strings'];
        expect(templateStringsRule).toBeInstanceOf(Array);
        expect(templateStringsRule[0]).toBe('error');
        expect(templateStringsRule[1]).toEqual(
            expect.objectContaining({
                env: expect.any(String),
                projectName: expect.any(String),
                schemaJsonFilepath: expect.any(String),
                validators: expect.any(Array)
            })
        );

        const deprecatedFieldsRule =
            lintConfiguration.rules['graphql/no-deprecated-fields'];
        expect(deprecatedFieldsRule).toEqual(warnRule);

        expect(lintConfiguration.useEslintrc).toBe(false);
    });

    test('it warns when there are errors', async () => {
        eslintCLIEngineSpy.mockImplementationOnce(() => ({
            executeOnFiles: jest.fn().mockImplementation(() => ({
                errorCount: Number.POSITIVE_INFINITY,
                results: {
                    length: Number.POSITIVE_INFINITY
                }
            })),
            getFormatter: jest.fn().mockImplementation(() => {
                return function() {};
            }),
            resolveFileGlobPatterns: jest.fn().mockReturnValue({
                length: Number.POSITIVE_INFINITY
            })
        }));

        await plugin.handler(mockContext, mockArgs);

        expect(mockConsoleWarn).toHaveBeenCalled();
        expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    test('it ignores AC and EE files if magentoBackendEdition is MOS', async () => {
        await plugin.handler(mockContext, mockArgs);

        expect(globSyncSpy.mock.calls[0][1].ignore).toContain('acFilesGlob');
        expect(globSyncSpy.mock.calls[0][1].ignore).toContain('eeFilesGlob');
    });

    test('it ignores AC and EE files if magentoBackendEdition is CE', async () => {
        getProjectConfig.mockResolvedValueOnce({
            config: {
                extensions: {
                    'validate-magento-pwa-queries': {
                        clients: ['apollo', 'literal'],
                        filesGlob: '*.graphql',
                        ignore: ['*.js'],
                        magentoBackendEdition: 'CE',
                        mosFilesGlob: 'mosFilesGlob',
                        ceFilesGlob: 'ceFilesGlob',
                        acFilesGlob: 'acFilesGlob',
                        eeFilesGlob: 'eeFilesGlob'
                    }
                },
                schemaPath: 'unit test'
            }
        });

        await plugin.handler(mockContext, mockArgs);

        expect(globSyncSpy.mock.calls[0][1].ignore).toContain('acFilesGlob');
        expect(globSyncSpy.mock.calls[0][1].ignore).toContain('eeFilesGlob');
    });

    test('it ignores MOS and CE files if magentoBackendEdition is AC', async () => {
        getProjectConfig.mockResolvedValueOnce({
            config: {
                extensions: {
                    'validate-magento-pwa-queries': {
                        clients: ['apollo', 'literal'],
                        filesGlob: '*.graphql',
                        ignore: ['*.js'],
                        magentoBackendEdition: 'AC',
                        mosFilesGlob: 'mosFilesGlob',
                        ceFilesGlob: 'ceFilesGlob',
                        acFilesGlob: 'acFilesGlob',
                        eeFilesGlob: 'eeFilesGlob'
                    }
                },
                schemaPath: 'unit test'
            }
        });

        await plugin.handler(mockContext, mockArgs);

        expect(globSyncSpy.mock.calls[0][1].ignore).toContain('mosFilesGlob');
        expect(globSyncSpy.mock.calls[0][1].ignore).toContain('ceFilesGlob');
    });

    test('it ignores MOS and CE files if magentoBackendEdition is EE', async () => {
        getProjectConfig.mockResolvedValueOnce({
            config: {
                extensions: {
                    'validate-magento-pwa-queries': {
                        clients: ['apollo', 'literal'],
                        filesGlob: '*.graphql',
                        ignore: ['*.js'],
                        magentoBackendEdition: 'EE',
                        mosFilesGlob: 'mosFilesGlob',
                        ceFilesGlob: 'ceFilesGlob',
                        acFilesGlob: 'acFilesGlob',
                        eeFilesGlob: 'eeFilesGlob'
                    }
                },
                schemaPath: 'unit test'
            }
        });

        await plugin.handler(mockContext, mockArgs);

        expect(globSyncSpy.mock.calls[0][1].ignore).toContain('mosFilesGlob');
        expect(globSyncSpy.mock.calls[0][1].ignore).toContain('ceFilesGlob');
    });
});
