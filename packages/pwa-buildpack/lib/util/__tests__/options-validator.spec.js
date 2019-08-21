const makeValidator = require('../options-validator');

test('creates a validation function from a schema', () => {
    expect(makeValidator()).toBeInstanceOf(Function);
});

test('returns undefined if no problems', () => {
    const validate = makeValidator('Foo', { opt1: 'number' });
    expect(validate('unittest', { opt1: 5 })).toBeUndefined();
});

test('throws formatted error if a key is missing', () => {
    const validate = makeValidator('Foo', { opt1: 'undefined' });
    expect(() => validate('unittest', {})).toThrow(/Foo: Invalid/gim);
    expect(() => validate('unittest', {})).toThrow(/unittest was called/gim);
    expect(() => validate('unittest', {})).toThrow(
        /opt1 must be of type undefined/gim
    );
});
