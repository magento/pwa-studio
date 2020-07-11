import { useMemo } from 'react';

export const useFormError = props => {
    const { errors } = props;

    const derivedErrorMessage = useMemo(() => {
        const errorCollection = errors.filter(Boolean).map(error => {
            const { graphQLErrors, message } = error;

            return graphQLErrors && graphQLErrors.length
                ? graphQLErrors.map(({ message }) => message).join(', ')
                : message;
        });

        return errorCollection.join(', ');
    }, [errors]);

    return {
        errorMessage: derivedErrorMessage
    };
};
