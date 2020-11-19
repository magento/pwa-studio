jest.mock('fs');

const { writeFileSync } = require('fs');
jest.mock('../Utilities/getEnvVarDefinitions', () => () =>
    require('../../envVarDefinitions.json')
);
const createEnvCliBuilder = require('../cli/create-env-file');

jest.mock('../Utilities/createDotEnvFile', () =>
    jest.fn().mockResolvedValue('DOT ENV FILE CONTENTS')
);

jest.mock('path', () => {
    const path = jest.requireActual('path');

    return {
        ...path,
        resolve: jest.fn().mockReturnValue('./pwa-studio/.env')
    };
});

beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

test('is a yargs builder', () => {
    expect(createEnvCliBuilder).toMatchObject({
        command: expect.stringContaining('create-env-file'),
        describe: expect.stringContaining('environment'),
        handler: expect.any(Function)
    });
});

test('creates and writes file', async () => {
    process.env.MAGENTO_BACKEND_URL = 'https://example.com/';
    await createEnvCliBuilder.handler({
        directory: process.cwd()
    });
    expect(writeFileSync).toHaveBeenCalledWith(
        './pwa-studio/.env',
        'DOT ENV FILE CONTENTS',
        'utf8'
    );
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('wrote'));
});

test('creates and writes file with examples', async () => {
    process.env.MAGENTO_BACKEND_URL = 'https://example.com/';
    await createEnvCliBuilder.handler({
        directory: process.cwd(),
        useExamples: true
    });
    expect(writeFileSync).toHaveBeenCalledWith(
        './pwa-studio/.env',
        'DOT ENV FILE CONTENTS',
        'utf8'
    );
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('wrote'));
});
