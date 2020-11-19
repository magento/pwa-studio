jest.mock('fs');

const { writeFileSync } = require('fs');
const dotenv = require('dotenv');
jest.mock('../Utilities/getEnvVarDefinitions', () => () =>
    require('../../envVarDefinitions.json')
);
const createEnvCliBuilder = require('../cli/create-env-file');

// jest.mock('path', () => {
//     const path = jest.requireActual('path');

//     return {
//         ...path,
//         resolve: jest.fn().mockReturnValue()
//     };
// });

const RealToISOString = Date.prototype.toISOString;

beforeAll(() => {
    global.Date.prototype.toISOString = jest
        .fn()
        .mockReturnValue('2019-04-22T10:20:30Z');
});

afterAll(() => {
    global.Date.prototype.toISOString = RealToISOString;
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
    expect(writeFileSync).toHaveBeenCalled();
    expect(writeFileSync.mock.calls[0]).toMatchSnapshot();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('wrote'));
});

test('creates and writes file with examples', async () => {
    process.env.MAGENTO_BACKEND_URL = 'https://example.com/';
    await createEnvCliBuilder.handler({
        directory: process.cwd(),
        useExamples: true
    });
    expect(writeFileSync).toHaveBeenCalled();
    expect(writeFileSync.mock.calls[0]).toMatchSnapshot();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('wrote'));
    const writtenFile = writeFileSync.mock.calls[0][1];
    expect(dotenv.parse(writtenFile)).toMatchObject({
        MAGENTO_BACKEND_URL: 'https://example.com/'
    });
});
