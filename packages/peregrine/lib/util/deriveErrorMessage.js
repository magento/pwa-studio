/**
 * Maps an error to a string message
 *
 * @param {Error} error the error to map
 * @return {String} error message
 */

const toString = (error, defaultErrorMessage) => {
    const { graphQLErrors, message } = error;

    if (graphQLErrors && graphQLErrors.length) {
        if (defaultErrorMessage) {
            return defaultErrorMessage;
        }
        return graphQLErrors.map(({ message }) => message).join(', ');
    }

    return message;
};

/**
 * A function to derive an error string from an array of errors.
 */
export const deriveErrorMessage = (errors, defaultErrorMessage = '') => {
    const errorCollection = [];
    for (const error of errors) {
        if (error) {
            errorCollection.push(toString(error, defaultErrorMessage));
        }
    }

    return errorCollection.join(', ');
};
