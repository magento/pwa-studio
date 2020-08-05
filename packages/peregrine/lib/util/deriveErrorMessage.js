/**
 * A function to derive an error string from an array of errors.
 */
export const deriveErrorMessage = errors => {
    const errorCollection = errors.filter(Boolean).map(error => {
        const { graphQLErrors, message } = error;

        return graphQLErrors && graphQLErrors.length
            ? graphQLErrors.map(({ message }) => message).join(', ')
            : message;
    });

    return errorCollection.join(', ');
};
