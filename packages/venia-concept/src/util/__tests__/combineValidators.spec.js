import combine from '../combineValidators';
const isRequired = jest.fn();
const isRequiredFail = jest.fn(() => 'string');
const hasLengthExactly = jest.fn('');

describe('combine', () => {
    test('combine single callback', () => {
        const result = combine([isRequired]);

        expect(result).toBeInstanceOf(Function);
    });

    test('combine two callbacks, the second is the extended callback with additional param', () => {
        const result = combine([isRequired, [hasLengthExactly, 4]]);

        expect(result).toBeInstanceOf(Function);
    });

    test('throws an error on passing not array', () => {
        expect(() => combine('string')).toThrow(
            'Expected `callbacks` to be array.'
        );
    });

    test('throws an error on passing not function as extended callback on validate', () => {
        expect(() => combine([isRequired, ['string', 4]])('string')).toThrow(
            'Expected `callbacks[1][0]` to be function.'
        );
    });

    test('throws an error on passing not array or function as callback', () => {
        expect(() => combine([isRequired, 'string'])('string')).toThrow(
            'Expected `callbacks[1]` to be array or function.'
        );
    });

    test('test calling the single validator', () => {
        combine([isRequired])();

        expect(isRequired).toHaveBeenCalledTimes(1);
    });

    test('test calling the single fail validator', () => {
        const result = combine([isRequiredFail])();

        expect(isRequiredFail).toHaveBeenCalledTimes(1);
        expect(typeof result).toBe('string');
    });

    test('test calling validators', () => {
        combine([isRequired, hasLengthExactly])();

        expect(isRequired).toHaveBeenCalledTimes(1);
        expect(hasLengthExactly).toHaveBeenCalledTimes(1);
    });

    test('test calling validators, the second is extended', () => {
        combine([isRequired, [hasLengthExactly, 4]])();

        expect(isRequired).toHaveBeenCalledTimes(1);
        expect(hasLengthExactly).toHaveBeenCalledTimes(1);
    });

    test('the first validator returned message, the second is never called', () => {
        const result = combine([isRequiredFail, [hasLengthExactly, 4]])();

        expect(isRequiredFail).toHaveBeenCalledTimes(1);
        expect(hasLengthExactly).toHaveBeenCalledTimes(0);
        expect(typeof result).toBe('string');
    });
});
