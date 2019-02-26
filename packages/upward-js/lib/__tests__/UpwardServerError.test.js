import UpwardServerError from '../UpwardServerError';

const MOCK_ERROR_MESSAGE = 'Unit Test';
const MOCK_ERROR = new Error(MOCK_ERROR_MESSAGE);
const MOCK_ADDITIONAL_MESSAGE = 'Additional Unit Test Message';

describe('class', () => {
    test('it is of type Error', () => {
        const result = new UpwardServerError(
            MOCK_ERROR,
            MOCK_ADDITIONAL_MESSAGE
        );

        expect(result).toBeInstanceOf(Error);
    });

    test('it can accept an error object as its first argument', () => {
        const result = new UpwardServerError(MOCK_ERROR);

        expect(result).toBeInstanceOf(Error);
    });

    test('it can accept a string as its first argument', () => {
        const result = new UpwardServerError(MOCK_ERROR_MESSAGE);

        expect(result).toBeInstanceOf(Error);
    });
});

describe('name', () => {
    test('it equals "UpwardServerError"', () => {
        const result = new UpwardServerError(
            MOCK_ERROR,
            MOCK_ADDITIONAL_MESSAGE
        );

        expect(result.name).toBe('UpwardServerError');
    });
});

describe('message', () => {
    test('it appends a custom message to the original error', () => {
        const result = new UpwardServerError(
            MOCK_ERROR,
            MOCK_ADDITIONAL_MESSAGE
        );

        expect(result.message).toEqual(
            `Error: ${MOCK_ERROR_MESSAGE} -- ${MOCK_ADDITIONAL_MESSAGE}`
        );
    });

    test('it does not append a custom message if one is not present', () => {
        const result = new UpwardServerError(MOCK_ERROR);

        expect(result.message).toEqual(`Error: ${MOCK_ERROR_MESSAGE}`);
    });
});
