import isObjectEmpty from '../isObjectEmpty';

test('returns true for an empty object', () => {
    const obj = {};
    expect(isObjectEmpty(obj)).toEqual(true);
});

test('returns false for a non-empty object', () => {
    const obj = { unit: 'test' };
    expect(isObjectEmpty(obj)).toEqual(false);
});
