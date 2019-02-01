import { isRequired } from '../formValidators';
import combine from '../combineValidators';

describe('combine', () => {
    test('it returns function on success', () => {
        const result = combine([isRequired]);

        expect(result).toBeInstanceOf(Function);
    });

    test('it throws an error on failure', () => {
        const result = combine('string');

        expect(result).toThrow(Error);
    });

    //TODO: provide a deep coverage
});
