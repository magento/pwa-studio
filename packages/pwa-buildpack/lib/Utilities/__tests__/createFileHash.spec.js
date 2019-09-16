const fs = require('fs');

const createFileHash = require('../createFileHash');

test('Should return a promise that resolves to a string', async () => {
    const returnValue = createFileHash('./sampleFile.txt');

    expect(returnValue instanceof Promise).toBeTruthy();

    const hash = await returnValue;

    expect(typeof hash).toBe('string');
});

test('Should return same hash if the contents of the file has not changed', async () => {
    const oldValue = await createFileHash('./sampleFile.txt');
    const newValue = await createFileHash('./sampleFile.txt');

    expect(oldValue === newValue).toBeTruthy();
});

test('Should return different value if the contents of the same file have changed', async () => {
    const oldValue = await createFileHash('./sampleFile.txt');

    fs.appendFileSync('sampleFile.txt', ' Venia here.');

    const newValue = await createFileHash('./sampleFile.txt');

    expect(oldValue === newValue).toBeFalsy();

    fs.truncateSync('sampleFile.txt', 11);
});

test('Should not throw error if given file path is invalid. Instead should print error in console', async () => {
    const errorLogger = jest.fn();

    console.error = errorLogger;

    await createFileHash('./sampleFile');

    expect(errorLogger).toHaveBeenCalled();
});
