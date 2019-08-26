jest.doMock('dotenv');
jest.doMock('word-wrap', () => x => x);
let definitions;
jest.doMock('../../../envVarDefinitions.json', () => definitions);
const debug = jest.fn().mockName('debug');
jest.doMock('debug', () => () => debug);
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

const dotenv = require('dotenv');
const envalid = require('envalid');
jest.spyOn(envalid, 'cleanEnv');

beforeEach(() => {
    definitions = {
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
    };
});

afterEach(jest.clearAllMocks);

afterAll(jest.resetModules);

test('throws on load if variable defs are invalid', () => {
    definitions = {
        sections: [
            {
                name: 'inscrutable',
                variables: [
                    {
                        type: 'ineffable'
                    }
                ]
            }
        ]
    };
    jest.isolateModules(() => {
        expect(() => require('../loadEnvironment')).toThrow(
            'Bad environment variable definition'
        );
    });
});

test('parses dotenv file if argument is path string', () => {
    dotenv.config.mockReturnValueOnce({
        parsed: 'DOTENV PARSED'
    });
    let loadEnvironment;
    jest.isolateModules(() => {
        loadEnvironment = require('../loadEnvironment');
    });
    const { envFilePresent } = loadEnvironment('/path/to/dir');
    expect(envFilePresent).toBe(true);
    expect(dotenv.config).toHaveBeenCalledWith({ path: '/path/to/dir/.env' });
});

test('debug logs environment in human readable way', () => {
    debug.enabled = true;
    let loadEnvironment;
    jest.isolateModules(() => {
        loadEnvironment = require('../loadEnvironment');
    });
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
    let loadEnvironment;
    jest.isolateModules(() => {
        loadEnvironment = require('../loadEnvironment');
    });
    const { envFilePresent } = loadEnvironment('/path/to/dir');
    expect(envFilePresent).toBe(false);
});

test('warns but continues if .env has errors', () => {
    dotenv.config.mockReturnValueOnce({
        error: new Error('blagh')
    });
    let loadEnvironment;
    jest.isolateModules(() => {
        loadEnvironment = require('../loadEnvironment');
    });
    loadEnvironment('/path/to/dir');
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/could not.*parse/i),
        expect.any(Error)
    );
});

test('emits errors on type mismatch', () => {
    let loadEnvironment;
    jest.isolateModules(() => {
        loadEnvironment = require('../loadEnvironment');
    });
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
    let loadEnvironment;
    jest.isolateModules(() => {
        loadEnvironment = require('../loadEnvironment');
    });
    expect(() => loadEnvironment({})).toThrow('cannot even');
});

test('emits log messages on a custom logger', () => {
    const mockLog = {
        warn: jest.fn().mockName('mockLog.warn'),
        error: jest.fn().mockName('mockLog.error')
    };

    definitions = {
        sections: [
            {
                variables: [
                    {
                        type: 'bool',
                        name: 'MUST_BE_BOOLEAN_DUDE'
                    }
                ]
            }
        ]
    };
    jest.isolateModules(() => {
        require('../loadEnvironment')(
            {
                MUST_BE_BOOLEAN_DUDE: 'twelve'
            },
            mockLog
        );
        expect(mockLog.error).toHaveBeenCalledWith(
            expect.stringContaining('MUST_BE_BOOLEAN_DUDE')
        );
    });
});

test('logs all types of change', () => {
    definitions = {
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
    let loadEnvironment;
    jest.isolateModules(() => {
        loadEnvironment = require('../loadEnvironment');
    });
    loadEnvironment({
        HAS_DEFAULT_CHANGE: 'old default',
        HAS_EXAMPLE_CHANGE: 'old example',
        HAS_BEEN_REMOVED: 'motivation',
        RON_ARTEST: 'hi',
        LEW_ALCINDOR: 'hi',
        HAKEEM_OLAJUWON: 'hi',
        AKEEM_OLAJUWON: 'hi',
        LIVE_DIE_REPEAT: 'already using updated name'
    });
    expect(console.warn).toHaveBeenCalledTimes(6);
    // Short test strings to support line breaks from word wrapping
    expect(console.warn.mock.calls[0][0]).toMatch('Old value: old default');
    expect(console.warn.mock.calls[0][0]).toMatch('New value: new default');
    expect(console.warn.mock.calls[1][0]).toMatch('Old value: old example');
    expect(console.warn.mock.calls[1][0]).toMatch('New value: new example');
    expect(console.warn.mock.calls[2][0]).toMatch('removed');
    expect(console.warn.mock.calls[2][0]).toMatch('ignored');
    expect(console.warn.mock.calls[3][0]).toMatch('new');
    expect(console.warn.mock.calls[3][0]).toMatch('METTA');
    expect(console.warn.mock.calls[3][0]).toMatch('continue');
    expect(console.warn.mock.calls[4][0]).toMatch('KAREEM');
    expect(console.warn.mock.calls[4][0]).toMatch('functional');
});

test('throws if change defs are invalid', () => {
    definitions = {
        sections: [],
        changes: [
            {
                type: 'unwanted'
            }
        ]
    };
    let loadEnvironment;
    jest.isolateModules(() => {
        loadEnvironment = require('../loadEnvironment');
    });
    expect(() => loadEnvironment({})).toThrow('unknown change type');
});

test('returns configuration object', () => {
    let loadEnvironment;
    jest.isolateModules(() => {
        definitions = {
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
        };
        loadEnvironment = require('../loadEnvironment');
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
