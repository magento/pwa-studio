import { isString } from 'util';

const emptyFieldMessage = 'This field cannot be empty';
export const defaultIsRequired = value =>
    isString(value) && value.length > 0 ? null : emptyFieldMessage;

export const createComplexValidator = validators => (value, values = null) => {
    for (let i = 0; i < validators.length; i++) {
        const validatorOutput = validators[i](value, values);

        if (validatorOutput) {
            return validatorOutput;
        } else if (i + 1 < validators.length) {
            // If current iteration is on the last validator
            // and this validator hasn't returned error
            // we need to return null as result of whole complex valdiator
            continue;
        } else {
            return null;
        }
    }
};
