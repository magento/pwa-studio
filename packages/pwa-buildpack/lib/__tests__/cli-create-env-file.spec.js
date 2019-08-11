jest.mock('fs');
const { resolve } = require('path');
const { writeFileSync } = require('fs');
const dotenv = require('dotenv');
const createEnvCliBuilder = require('../cli/create-env-file');

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

test('creates and writes file', () => {
    jest.resetModules();
    process.env.MAGENTO_BACKEND_URL = 'https://example.com/';
    createEnvCliBuilder.handler({
        directory: process.cwd()
    });
    expect(writeFileSync).toHaveBeenCalledWith(
        resolve(process.cwd(), '.env'),
        expect.stringContaining('https://example.com/'),
        'utf8'
    );
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('wrote'));
});

test('creates and writes file with examples', () => {
    jest.resetModules();
    process.env.MAGENTO_BACKEND_URL = 'https://example.com/';
    createEnvCliBuilder.handler({
        directory: process.cwd(),
        useExamples: true
    });
    expect(writeFileSync).toHaveBeenCalledWith(
        resolve(process.cwd(), '.env'),
        expect.stringContaining('https://example.com/'),
        'utf8'
    );
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('wrote'));
    const writtenFile = writeFileSync.mock.calls[0][1];
    expect(dotenv.parse(writtenFile)).toMatchObject({
        MAGENTO_BACKEND_URL: 'https://example.com/'
    });
});
