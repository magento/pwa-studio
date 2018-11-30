import { isString } from 'util';

const emptyFieldMessage = 'This field cannot be empty';
export const isRequired = value =>
    isString(value) && value.length > 0 ? null : emptyFieldMessage;

export const createComplexValidator = validators => (value, values = null) => {
    for (let validator of validators) {
        const validatorOutput = validator(value, values);
        if (validatorOutput) {
            return validatorOutput;
        }
    }
    return null;
};
