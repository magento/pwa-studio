const path = require('path');
const fs = require('fs');

const createFileHash = require('../createFileHash');

const DEFAULT_SAMPLE_FILE_PATH = path.join(
    path.resolve(__dirname).split('/packages')[0],
    'packages',
    'pwa-buildpack',
    'lib',
    'Utilities',
    '__tests__',
    'sampleFile.txt'
);

test('Should return a promise that resolves to a string', async () => {
    const returnValue = createFileHash(DEFAULT_SAMPLE_FILE_PATH);

    expect(returnValue instanceof Promise).toBeTruthy();

    const hash = await returnValue;

    expect(typeof hash).toBe('string');
});

test('Should return same hash if the contents of the file has not changed', async () => {
    const oldValue = await createFileHash(DEFAULT_SAMPLE_FILE_PATH);
    const newValue = await createFileHash(DEFAULT_SAMPLE_FILE_PATH);

    expect(oldValue === newValue).toBeTruthy();
});

test('Should return different value if the contents of the same file have changed', async () => {
    const oldValue = await createFileHash(DEFAULT_SAMPLE_FILE_PATH);

    fs.appendFileSync(`${__dirname}/sampleFile.txt`, ' Venia here.');

    const newValue = await createFileHash(DEFAULT_SAMPLE_FILE_PATH);

    fs.truncateSync(`${__dirname}/sampleFile.txt`, 11);

    expect(oldValue === newValue).toBeFalsy();
});

test('Should not throw error if given file path is invalid. Instead should print error in console and resolve to empty string as hash', async () => {
    const errorLogger = jest.fn();

    console.error = errorLogger;

    const hash = await createFileHash('./sampleFile');

    expect(hash).toBe('');
    expect(errorLogger).toHaveBeenCalled();
});
