import { isString } from 'util';

//TODO: write proper validation error message
const invalidStateFieldMessage = 'State field must be at least 2 characters';

//TODO: implement proper validation for the state field
export const validatorStateField = value => {
    return isString(value) && value.length > 1
        ? null
        : invalidStateFieldMessage;
};
