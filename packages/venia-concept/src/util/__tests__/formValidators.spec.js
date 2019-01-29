import * as validators from '../formValidators';

describe('hasLengthAtLeast', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthAtLeast('test', 1);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthAtLeast('test', 10);

        expect(typeof result).toBe('string');
    });
});

describe('hasLengthAtMost', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthAtMost('test', 10);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthAtMost('test', 1);

        expect(typeof result).toBe('string');
    });
});

describe('hasLengthExactly', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthExactly('test', 4);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthExactly('test', 1);

        expect(typeof result).toBe('string');
    });
});

describe('isNotEmpty', () => {
    test('it returns undefined on success', () => {
        const result = validators.isNotEmpty('test');

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.isNotEmpty('');

        expect(typeof result).toBe('string');
    });
});
