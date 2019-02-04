import * as validators from '../formValidators';

describe('hasLengthAtLeast', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthAtLeast('test', [], 1);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthAtLeast('test', [], 10);

        expect(typeof result).toBe('string');
    });
});

describe('hasLengthAtMost', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthAtMost('test', [], 10);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthAtMost('test', [], 1);

        expect(typeof result).toBe('string');
    });
});

describe('hasLengthExactly', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthExactly('test', [], 4);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthExactly('test', [], 1);

        expect(typeof result).toBe('string');
    });
});

describe('isRequired', () => {
    test('it returns null on success', () => {
        const result = validators.isRequired('test');

        expect(result).toBeNull();
    });

    test('it returns a string on failure', () => {
        const result = validators.isRequired('');

        expect(typeof result).toBe('string');
    });

    test('it returns a string on failure', () => {
        const result = validators.isRequired(' ');

        expect(typeof result).toBe('string');
    });
});

describe('validateEmail', () => {
    test('it returns null on success', () => {
        const result = validators.validateEmail('johndoe@domain.com');

        expect(result).toBeNull();
    });

    test('it returns null on success', () => {
        const result = validators.validateEmail('');

        expect(result).toBeNull();
    });

    test('it returns a string on failure', () => {
        const result = validators.validateEmail('johndoe@domain');

        expect(typeof result).toBe('string');
    });
});

describe('validateRegionCode', () => {
    const countries = [
        {
            id: 'US',
            available_regions: [
                {
                    id: '1',
                    code: 'AL',
                    name: 'Alabama'
                }
            ]
        },
        { id: 'UA' },
        { id: 'UK' }
    ];

    test('it returns null on success', () => {
        const result = validators.validateRegionCode('AL', [], countries);

        expect(result).toBeNull();
    });

    test('it returns null on success', () => {
        const result = validators.validateRegionCode('');

        expect(result).toBeNull();
    });

    test('it returns a string on failure', () => {
        const result = validators.validateRegionCode(
            'some_string',
            [],
            countries
        );

        expect(typeof result).toBe('string');
    });
});
