jest.doMock('dotenv');

const debug = jest.fn().mockName('debug');
jest.doMock('debug', () => () => debug);
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const daysAgo = days => {
    const today = new Date();
    return new Date(today - days * ONE_DAY_MS).getTime();
};

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

jest.doMock('../runEnvValidators');
const validateEnv = require('../runEnvValidators');
validateEnv.mockResolvedValue(true);

jest.mock('../../../package.json', () => {
    const packageJson = jest.requireActual('../../../package.json');

    return {
        ...packageJson,
        version: '123.45-test.1'
    };
});

afterEach(jest.clearAllMocks);

const stripAnsi = require('strip-ansi');

const CompatEnvAdapter = require('../CompatEnvAdapter');

let oldReleaseName;
beforeAll(() => {
    oldReleaseName = CompatEnvAdapter.RELEASE_NAME;
    CompatEnvAdapter.RELEASE_NAME = 'Buildpack vX.X.X-snapshot-testing';
});
afterAll(() => {
    CompatEnvAdapter.RELEASE_NAME = oldReleaseName;
});

const loadEnvironment = require('../loadEnvironment');

test('throws on load if variable defs are invalid', async () => {
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

    await expect(loadEnvironment('./')).rejects.toThrowErrorMatchingSnapshot();
});

test('parses dotenv file if argument is path string', async () => {
    dotenv.config.mockReturnValueOnce({
        parsed: 'DOTENV PARSED'
    });
    const { envFilePresent } = await loadEnvironment('/path/to/dir');
    expect(envFilePresent).toBe(true);
    expect(dotenv.config).toHaveBeenCalledWith({ path: '/path/to/dir/.env' });
});

test('warns on deprecated api use', async () => {
    await loadEnvironment({
        MUST_BE_BOOLEAN_DUDE: false
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('deprecated')
    );
});

test('does not warn if deprecated API is okay', async () => {
    await loadEnvironment(
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

test('debug logs environment in human readable way', async () => {
    debug.enabled = true;
    await loadEnvironment({
        MUST_BE_BOOLEAN_DUDE: false
    });
    expect(debug).toHaveBeenCalledWith(
        expect.stringMatching(/known env/),
        expect.stringMatching(/MUST_BE_BOOLEAN_DUDE.*false/)
    );
    debug.enabled = true;
});

test('sets envFilePresent to false if .env is missing', async () => {
    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';
    dotenv.config.mockReturnValueOnce({
        error: enoent
    });
    const { envFilePresent } = await loadEnvironment('/path/to/dir');
    expect(envFilePresent).toBe(false);
});

test('warns but continues if .env has errors', async () => {
    dotenv.config.mockReturnValueOnce({
        error: new Error('blagh')
    });
    await loadEnvironment('/path/to/dir');
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/could not.*parse/i),
        expect.any(Error)
    );
});

test('emits errors on type mismatch', async () => {
    const { error } = await loadEnvironment({
        MUST_BE_BOOLEAN_DUDE: 'but it aint'
    });
    expect(error.message).toMatch(/MUST_BE_BOOLEAN/);
    expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('MUST_BE_BOOLEAN_DUDE')
    );
});

test('throws anything unexpected from validation', async () => {
    envalid.cleanEnv.mockImplementationOnce(() => {
        throw new Error('invalid in a way i cannot even describe');
    });

    try {
        await loadEnvironment({});
    } catch (e) {
        expect(e.message).toBe('invalid in a way i cannot even describe');
    }
});

test('emits log messages on a custom logger', async () => {
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
    await loadEnvironment(
        {
            MUST_BE_BOOLEAN_DUDE: 'twelve'
        },
        mockLog
    );
    expect(mockLog.error).toHaveBeenCalledWith(
        expect.stringContaining('MUST_BE_BOOLEAN_DUDE')
    );
});

test('logs all types of change', async () => {
    const defs = {
        sections: [
            {
                name: 'everything deprecated!',
                variables: [
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
                    },
                    {
                        type: 'str',
                        name: 'REMOVED_LONG_AGO',
                        desc:
                            'was removed longer ago than the max 180 days for warning'
                    },
                    {
                        type: 'str',
                        name: 'EXPIRES_QUICKLY',
                        desc:
                            'was removed but the change was set to warn for only 5 days'
                    },
                    {
                        type: 'str',
                        name: 'SILENTLY_FAIL',
                        desc:
                            'predates the max warn interval, should act expired'
                    }
                ]
            }
        ],
        changes: [
            {
                type: 'renamed',
                name: 'HAKEEM_OLAJUWON',
                original: 'HAKEEM_OLAJUWON',
                update: 'AKEEM_OLAJUWON',
                reason: 'spelling correction',
                supportLegacy: true,
                dateChanged: daysAgo(0)
            },
            {
                type: 'removed',
                name: 'HAS_BEEN_REMOVED',
                reason: 'creative destruction',
                dateChanged: daysAgo(5)
            },
            {
                type: 'renamed',
                name: 'RON_ARTEST',
                original: 'RON_ARTEST',
                update: 'METTA_WORLD_PEACE',
                reason: 'inspiration',
                supportLegacy: true,
                dateChanged: daysAgo(90)
            },
            {
                type: 'removed',
                name: 'EXPIRES_QUICKLY',
                reason: 'only warns for a few days',
                dateChanged: daysAgo(10),
                warnForDays: 5
            },
            {
                type: 'removed',
                name: 'REMOVED_LONG_AGO',
                reason: 'cruel time',
                dateChanged: '1/1/1970'
            },
            {
                type: 'renamed',
                name: 'LEW_ALCINDOR',
                original: 'LEW_ALCINDOR',
                update: 'KAREEM_ABDUL_JABBAR',
                reason: 'faith',
                supportLegacy: false,
                dateChanged: daysAgo(50)
            },
            {
                type: 'renamed',
                name: 'EDGE_OF_TOMORROW',
                original: 'EDGE_OF_TOMORROW',
                update: 'LIVE_DIE_REPEAT',
                reason: 'testing',
                supportLegacy: true,
                dateChanged: daysAgo(0)
            },
            {
                type: 'removed',
                name: 'SILENTLY_FAIL',
                reason: 'an old envVarDefinitions file with no dateChanged'
            },
            {
                type: 'unknown',
                name: 'LEW_ALCINDOR',
                reason:
                    'unknown changes should silently fail, since they are tested before deploy',
                dateChanged: daysAgo(1)
            }
        ]
    };
    await loadEnvironment(
        {
            HAS_BEEN_REMOVED: 'motivation',
            RON_ARTEST: 'hi',
            LEW_ALCINDOR: 'hi',
            HAKEEM_OLAJUWON: 'hi',
            AKEEM_OLAJUWON: 'hi',
            LIVE_DIE_REPEAT: 'already using updated name',
            EXPIRES_QUICKLY: 'should never appear',
            SILENTLY_FAIL: 'should never appear either'
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

test('ignores invalid change defs', async () => {
    getEnvVarDefinitions.mockReturnValueOnce({
        sections: [],
        changes: [
            {
                type: 'unwanted',
                name: 'OH_NOES'
            }
        ]
    });
    expect(() => loadEnvironment({ OH_NOES: 'foo' })).not.toThrow();
});

test('returns configuration object', async () => {
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
    const config = await loadEnvironment({ ...party, NODE_ENV: 'test' });
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

test('augments with interceptors of envVarDefinitions target', async () => {
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
    await loadEnvironment('./other/context');
    expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('SIGNAL_INTENSITY')
    );
});
