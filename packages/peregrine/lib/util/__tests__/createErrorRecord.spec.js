import errorRecord from '../createErrorRecord';

jest.spyOn(console, 'error');

const fakeSeconds = jest.fn();
const fakeRandom = jest.fn();

const fakeWindow = {
    location: window.location,
    Date: class {
        getSeconds() {
            return fakeSeconds();
        }
    },
    Math: {
        random: fakeRandom
    }
};

beforeEach(() => {
    console.error.mockClear();
    fakeSeconds.mockClear();
    fakeRandom.mockClear();
});

afterAll(() => {
    console.error.mockRestore();
});

const firstError = new Error('test');
test('creates a record from an error', () => {
    fakeSeconds.mockReturnValueOnce(30);
    fakeRandom.mockReturnValueOnce(0.456);
    const record = errorRecord(firstError, fakeWindow);
    expect(record).toMatchObject({
        error: firstError,
        id: 'Error30G',
        loc: expect.stringMatching(/^at /)
    });
});

test('caches already seen errors', () => {
    const record = errorRecord(firstError, fakeWindow);
    expect(record).toMatchObject({
        error: firstError,
        id: 'Error30G',
        loc: expect.stringMatching(/^at /)
    });
    expect(fakeSeconds).not.toHaveBeenCalled();
});

test('makes IDs from error names or constructor names', () => {
    fakeSeconds.mockReturnValue(1);
    fakeRandom.mockReturnValue(0.1);
    class CustomError extends Error {}

    expect(errorRecord(new CustomError('bluh'), fakeWindow)).toMatchObject({
        id: 'CustomError13'
    });

    Object.defineProperty(CustomError, 'name', {
        value: 'CustomNameOverride'
    });
    expect(errorRecord(new CustomError('blar'), fakeWindow)).toMatchObject({
        id: 'CustomNameOverride13'
    });

    Object.defineProperty(CustomError, 'name', {
        value: undefined
    });
    const errorWithName = new CustomError('ack');
    Object.defineProperty(errorWithName, 'name', {
        value: 'ACK'
    });
    expect(errorRecord(errorWithName, fakeWindow)).toMatchObject({
        id: 'ACK13'
    });

    const errorWithNoConstructor = new Error('ack');
    Object.defineProperties(errorWithNoConstructor, {
        constructor: {
            value: undefined
        },
        name: {
            value: 'woah'
        }
    });
    expect(errorRecord(errorWithNoConstructor, fakeWindow)).toMatchObject({
        id: 'woah13'
    });
});

test('uses custom stacks', () => {
    fakeSeconds.mockReturnValue(1);
    fakeRandom.mockReturnValue(0.1);
    expect(
        errorRecord(
            new Error('guh'),
            fakeWindow,
            {},
            'Error: guh\n at a custom stack'
        )
    ).toMatchObject({
        loc: 'at a custom stack'
    });
});

test('loc is empty if stack cannot be parsed', () => {
    fakeSeconds.mockReturnValue(1);
    fakeRandom.mockReturnValue(0.1);
    expect(
        errorRecord(new Error('guh'), fakeWindow, {}, 'an unrecognizable stack')
    ).toMatchObject({
        loc: ''
    });
});
