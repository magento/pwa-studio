jest.doMock('dotenv');
jest.doMock('word-wrap', () => x => x);

const debug = jest.fn().mockName('debug');
jest.doMock('debug', () => () => debug);
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

const dotenv = require('dotenv');

jest.doMock('pertain');
const pertain = require('pertain');

const envalid = require('envalid');
jest.spyOn(envalid, 'cleanEnv');

jest.doMock('../getEnvVarDefinitions');
const getEnvVarDefinitions = require('../getEnvVarDefinitions');
getEnvVarDefinitions.mockReturnValue({
    sections: [
        {
            variables: [
                {
                    type: 'bool',
                    name: 'MUST_BE_BOOLEAN_DUDE'
                }
            ]
        }
    ],
    changes: [
        {
            type: 'renamed',
            name: 'MUST_BE_BOOLEAN',
            update: 'MUST_BE_BOOLEAN_DUDE',
            reason: 'informality'
        }
    ]
});

afterEach(jest.clearAllMocks);

const stripAnsi = require('strip-ansi');
const loadEnvironment = require('../loadEnvironment');

test('throws on load if variable defs are invalid', () => {
    getEnvVarDefinitions.mockReturnValueOnce({
        sections: [
            {
                name: 'inscrutable',
                variables: [
                    {
                        type: 'ineffable'
                    }
                ]
            }
        ],
        changes: []
    });
    expect(() => loadEnvironment('./')).toThrow(
        'Bad environment variable definition'
    );
});

test('parses dotenv file if argument is path string', () => {
    dotenv.config.mockReturnValueOnce({
        parsed: 'DOTENV PARSED'
    });
    const { envFilePresent } = loadEnvironment('/path/to/dir');
    expect(envFilePresent).toBe(true);
    expect(dotenv.config).toHaveBeenCalledWith({ path: '/path/to/dir/.env' });
});

test('warns on deprecated api use', () => {
    loadEnvironment({
        MUST_BE_BOOLEAN_DUDE: false
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('deprecated')
    );
});

test('does not warn if deprecated API is okay', () => {
    loadEnvironment(
        {
            MUST_BE_BOOLEAN_DUDE: false
        },
        null,
        {
            sections: [
                {
                    name: 'testing',
                    variables: [
                        {
                            name: 'MUST_BE_BOOLEAN_DUDE',
                            type: 'bool',
                            desc: 'what it says on the tin'
                        }
                    ]
                }
            ],
            changes: []
        }
    );
    expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('deprecated')
    );
});

test('debug logs environment in human readable way', () => {
    debug.enabled = true;
    loadEnvironment({
        MUST_BE_BOOLEAN_DUDE: false
    });
    expect(debug).toHaveBeenCalledWith(
        expect.stringMatching(/known env/),
        expect.stringMatching(/MUST_BE_BOOLEAN_DUDE.*false/)
    );
    debug.enabled = true;
});

test('sets envFilePresent to false if .env is missing', () => {
    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';
    dotenv.config.mockReturnValueOnce({
        error: enoent
    });
    const { envFilePresent } = loadEnvironment('/path/to/dir');
    expect(envFilePresent).toBe(false);
});

test('warns but continues if .env has errors', () => {
    dotenv.config.mockReturnValueOnce({
        error: new Error('blagh')
    });
    loadEnvironment('/path/to/dir');
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/could not.*parse/i),
        expect.any(Error)
    );
});

test('emits errors on type mismatch', () => {
    const { error } = loadEnvironment({
        MUST_BE_BOOLEAN_DUDE: 'but it aint'
    });
    expect(error.message).toMatch(/MUST_BE_BOOLEAN/);
    expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('MUST_BE_BOOLEAN_DUDE')
    );
});

test('throws anything unexpected from validation', () => {
    envalid.cleanEnv.mockImplementationOnce(() => {
        throw new Error('invalid in a way i cannot even describe');
    });
    expect(() => loadEnvironment({})).toThrow('cannot even');
});

test('emits log messages on a custom logger', () => {
    const mockLog = {
        warn: jest.fn().mockName('mockLog.warn'),
        error: jest.fn().mockName('mockLog.error')
    };

    getEnvVarDefinitions.mockReturnValueOnce({
        sections: [
            {
                variables: [
                    {
                        type: 'bool',
                        name: 'MUST_BE_BOOLEAN_DUDE'
                    }
                ]
            }
        ],
        changes: []
    });
    loadEnvironment(
        {
            MUST_BE_BOOLEAN_DUDE: 'twelve'
        },
        mockLog
    );
    expect(mockLog.error).toHaveBeenCalledWith(
        expect.stringContaining('MUST_BE_BOOLEAN_DUDE')
    );
});

test('logs all types of change', () => {
    const defs = {
        sections: [
            {
                name: 'everything deprecated!',
                variables: [
                    {
                        type: 'str',
                        name: 'HAS_DEFAULT_CHANGE',
                        default: 'new default'
                    },
                    {
                        type: 'str',
                        name: 'HAS_EXAMPLE_CHANGE',
                        example: 'new example'
                    },
                    {
                        type: 'str',
                        name: 'HAS_BEEN_REMOVED'
                    },
                    {
                        type: 'str',
                        name: 'METTA_WORLD_PEACE',
                        desc: 'has been renamed'
                    },
                    {
                        type: 'str',
                        name: 'KAREEM_ABDUL_JABBAR',
                        desc: 'has been renamed and dropped support'
                    },
                    {
                        type: 'str',
                        name: 'LIVE_DIE_REPEAT',
                        desc: 'was renamed but unused'
                    }
                ]
            }
        ],
        changes: [
            {
                type: 'defaultChanged',
                name: 'HAS_DEFAULT_CHANGE',
                original: 'old default',
                reason: 'whimsy'
            },
            {
                type: 'defaultChanged',
                name: 'HAS_ANOTHER_DEFAULT_CHANGE',
                original: 'old other default',
                reason: 'delight',
                update: 'new other default'
            },
            {
                type: 'exampleChanged',
                name: 'HAS_EXAMPLE_CHANGE',
                original: 'old example',
                reason: 'capriciousness'
            },
            {
                type: 'removed',
                name: 'HAS_BEEN_REMOVED',
                reason: 'creative destruction'
            },
            {
                type: 'renamed',
                name: 'RON_ARTEST',
                original: 'RON_ARTEST',
                update: 'METTA_WORLD_PEACE',
                reason: 'inspiration',
                supportLegacy: true
            },
            {
                type: 'renamed',
                name: 'LEW_ALCINDOR',
                original: 'LEW_ALCINDOR',
                update: 'KAREEM_ABDUL_JABBAR',
                reason: 'faith',
                supportLegacy: false
            },
            {
                type: 'renamed',
                name: 'HAKEEM_OLAJUWON',
                original: 'HAKEEM_OLAJUWON',
                update: 'AKEEM_OLAJUWON',
                reason: 'spelling correction',
                supportLegacy: true
            },
            {
                type: 'renamed',
                name: 'EDGE_OF_TOMORROW',
                original: 'EDGE_OF_TOMORROW',
                update: 'LIVE_DIE_REPEAT',
                reason: 'testing',
                supportLegacy: true
            }
        ]
    };
    loadEnvironment(
        {
            HAS_DEFAULT_CHANGE: 'old default',
            HAS_EXAMPLE_CHANGE: 'old example',
            HAS_BEEN_REMOVED: 'motivation',
            RON_ARTEST: 'hi',
            LEW_ALCINDOR: 'hi',
            HAKEEM_OLAJUWON: 'hi',
            AKEEM_OLAJUWON: 'hi',
            LIVE_DIE_REPEAT: 'already using updated name'
        },
        null,
        defs
    );
    const consoleMessages = [];
    console.warn.mock.calls.forEach(args => {
        consoleMessages.push(args.map(stripAnsi));
    });
    expect(consoleMessages).toMatchSnapshot();
});

test('throws if change defs are invalid', () => {
    getEnvVarDefinitions.mockReturnValueOnce({
        sections: [],
        changes: [
            {
                type: 'unwanted'
            }
        ]
    });
    expect(() => loadEnvironment({})).toThrow('unknown change type');
});

test('returns configuration object', () => {
    getEnvVarDefinitions.mockReturnValueOnce({
        sections: [
            {
                name: 'trappings',
                variables: [
                    {
                        type: 'str',
                        name: 'TRAPPING_MONK'
                    },
                    {
                        type: 'str',
                        name: 'TRAPPING_ELF'
                    }
                ]
            },
            {
                name: 'gewgaws',
                variables: [
                    {
                        type: 'str',
                        name: 'GEWGAW_PALADIN'
                    },
                    {
                        type: 'str',
                        name: 'GEWGAW_ROGUE'
                    }
                ]
            }
        ],
        changes: []
    });
    const party = {
        TRAPPING_MONK: 'level 1',
        TRAPPING_ELF: 'level 2',
        GEWGAW_PALADIN: 'level 3',
        GEWGAW_ROGUE: 'level 4'
    };
    const config = loadEnvironment({ ...party, NODE_ENV: 'test' });
    expect(config).toMatchObject({
        isProd: false,
        isProduction: false,
        isDev: false,
        isDevelopment: false,
        isTest: true,
        env: party
    });
    expect(config.section('trapping')).toMatchObject({
        monk: 'level 1',
        elf: 'level 2'
    });
    expect(config.sections('gewgaw', 'trapping')).toMatchObject({
        gewgaw: {
            paladin: 'level 3',
            rogue: 'level 4'
        },
        trapping: {
            monk: 'level 1',
            elf: 'level 2'
        }
    });
    const all = config.all();
    expect(all).toMatchObject({
        trappingMonk: 'level 1',
        trappingElf: 'level 2',
        gewgawPaladin: 'level 3',
        gewgawRogue: 'level 4'
    });
    expect(all).not.toHaveProperty('mustang');
});

test('augments with interceptors of envVarDefinitions target', () => {
    getEnvVarDefinitions.mockReset();
    getEnvVarDefinitions.mockImplementationOnce(context =>
        jest.requireActual('../getEnvVarDefinitions')(context)
    );
    pertain.mockReturnValueOnce([
        {
            name: '@magento/pwa-buildpack',
            path: './declare-base',
            subject: 'pwa-studio.targets.declare'
        }
    ]);
    pertain.mockReturnValueOnce([
        {
            name: '@magento/pwa-buildpack',
            path: './intercept-base',
            subject: 'pwa-studio.targets.intercept'
        },
        {
            name: '@magento/fake-test',
            path: './fake-intercept',
            subject: 'pwa-studio.targets.intercept'
        }
    ]);

    jest.doMock(
        '../../BuildBus/fake-intercept',
        () => targets =>
            targets.of('@magento/pwa-buildpack').envVarDefinitions.tap(defs =>
                defs.sections.push({
                    name: 'whatsits',
                    variables: [
                        {
                            type: 'num',
                            name: 'SIGNAL_INTENSITY',
                            desc: 'what is that infernal noise'
                        }
                    ]
                })
            ),
        { virtual: true }
    );
    loadEnvironment('./other/context');
    expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('SIGNAL_INTENSITY')
    );
});
