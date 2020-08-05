jest.mock('../../util/pretty-logger', () => ({
    warn: jest.fn(),
    error: jest.fn()
}));
jest.mock('../getEnvVarDefinitions');
const dotenv = require('dotenv');
const getEnvVarDefinitions = require('../getEnvVarDefinitions');
const createDotEnvFile = require('../createDotEnvFile');
const prettyLogger = require('../../util/pretty-logger');
const MockProps = require('./__helpers__/MockProps');

const snapshotEnvFile = contents =>
    contents.replace(/Generated by @magento.+?on.+?\n/gim, '');

const envVarDefs = require('../../../envVarDefinitions.json');
const MAGENTO_BACKEND_URL_EXAMPLE = envVarDefs.sections
    .find(section => section.name === 'Connecting to a Magento store')
    .variables.find(v => v.name === 'MAGENTO_BACKEND_URL').example;
// skip the buildbus part!
getEnvVarDefinitions.mockReturnValue(envVarDefs);

const examples = {};
for (const section of envVarDefs.sections) {
    for (const variable of section.variables) {
        if (
            variable.hasOwnProperty('example') &&
            !variable.hasOwnProperty('default')
        ) {
            examples[variable.name] = variable.example;
        }
    }
}

const mockLog = {
    warn: jest.fn(),
    error: jest.fn()
};

const mockEnvVars = new MockProps(process.env, afterEach);

beforeEach(() => {
    prettyLogger.warn.mockClear();
    prettyLogger.error.mockClear();
    mockLog.warn.mockClear();
    mockLog.error.mockClear();
});

test('logs errors to default logger if env is not valid', () => {
    mockEnvVars.set({
        MAGENTO_BACKEND_URL: mockEnvVars.UNSET
    });
    createDotEnvFile('./');
    expect(prettyLogger.warn).toHaveBeenCalled();
});

test('uses alternate logger', () => {
    mockEnvVars.set({
        MAGENTO_BACKEND_URL: mockEnvVars.UNSET
    });
    createDotEnvFile('./', { logger: mockLog });
    expect(mockLog.warn).toHaveBeenCalled();
});

test('returns valid dotenv file if env is valid', () => {
    mockEnvVars.set(examples);
    const fileText = createDotEnvFile('./', { logger: mockLog });
    expect(snapshotEnvFile(fileText)).toMatchSnapshot();
    expect(dotenv.parse(fileText)).toMatchObject(examples);
});

test('populates with examples where available', () => {
    const unsetExamples = {};
    for (const key of Object.keys(examples)) {
        unsetExamples[key] = mockEnvVars.UNSET;
    }
    mockEnvVars.set(unsetExamples);
    const fileText = createDotEnvFile('./', { useExamples: true });
    expect(dotenv.parse(fileText)).toMatchObject(examples);
});

test('does not print example comment if value is set custom', () => {
    const fakeEnv = {
        ...examples,
        MAGENTO_BACKEND_URL: 'https://custom.url',
        IMAGE_SERVICE_CACHE_EXPIRES: 'a million years'
    };
    mockEnvVars.set(fakeEnv);
    const fileText = createDotEnvFile(fakeEnv);
    expect(fileText).not.toMatch(MAGENTO_BACKEND_URL_EXAMPLE);
    expect(fileText).not.toMatch(
        `Example: ${examples.IMAGE_SERVICE_CACHE_EXPIRES}`
    );
    expect(dotenv.parse(fileText)).not.toMatchObject(examples);
});

test('passing an env object works, but warns deprecation and assumes cwd is context', () => {
    getEnvVarDefinitions.mockReturnValue({
        sections: [
            {
                name: 'Nothing special',
                variables: [
                    {
                        name: 'TEST_ENV_VAR_NOTHING',
                        type: 'str',
                        desc: 'that doesnt look like anything to me'
                    },
                    {
                        name: 'TEST_ENV_VAR_SOMETHING',
                        type: 'bool',
                        desc: 'manichean!!',
                        default: true
                    }
                ]
            }
        ],
        changes: []
    });
    expect(
        snapshotEnvFile(
            createDotEnvFile({
                TEST_ENV_VAR_NOTHING: 'foo'
            })
        )
    ).toMatchSnapshot();
    expect(getEnvVarDefinitions).toHaveBeenCalledWith(process.cwd());
    expect(prettyLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('deprecated')
    );
});
