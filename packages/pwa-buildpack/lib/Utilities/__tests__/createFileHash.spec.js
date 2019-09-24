const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const createFileHash = require('../createFileHash');

const DEFAULT_SAMPLE_FILE_PATH = path.join(
    path.resolve(__dirname).split('/packages')[0],
    'packages',
    'pwa-buildpack',
    'lib',
    'Utilities',
    '__fixtures__',
    'sampleFile.txt'
);

test('Should return a promise that resolves to a string', async () => {
    const randomStringGenerator = jest.spyOn(crypto, 'randomBytes');

    const returnValue = createFileHash(DEFAULT_SAMPLE_FILE_PATH);

    const hash = await returnValue;

    expect(returnValue).toBeInstanceOf(Promise);
    expect(randomStringGenerator).not.toHaveBeenCalled();
    expect(typeof hash).toBe('string');

    randomStringGenerator.mockRestore();
});

test('Should return same hash if the contents of the file has not changed', async () => {
    const oldValue = await createFileHash(DEFAULT_SAMPLE_FILE_PATH);
    const newValue = await createFileHash(DEFAULT_SAMPLE_FILE_PATH);

    expect(oldValue).toBe(newValue);
});

test('Should return different value if the contents of the same file have changed', async () => {
    const oldValue = await createFileHash(DEFAULT_SAMPLE_FILE_PATH);

    fs.appendFileSync(DEFAULT_SAMPLE_FILE_PATH, ' Venia here.');

    const newValue = await createFileHash(DEFAULT_SAMPLE_FILE_PATH);

    expect(oldValue).not.toBe(newValue);

    // Clean up
    fs.truncateSync(DEFAULT_SAMPLE_FILE_PATH, 11);
});

test('Should not throw error if given file path is invalid. Instead should print error in console and resolve to random string as hash', async () => {
    const errorLogger = jest.spyOn(console, 'error');
    const randomStringGenerator = jest.spyOn(crypto, 'randomBytes');

    const hash = await createFileHash('./sampleFile');

    expect(errorLogger).toHaveBeenCalled();
    expect(randomStringGenerator).toHaveBeenCalled();
    expect(hash).not.toBe('');

    errorLogger.mockRestore();
    randomStringGenerator.mockRestore();
});
