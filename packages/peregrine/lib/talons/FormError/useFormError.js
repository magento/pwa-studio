import { useMemo } from 'react';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';
import { useIntl } from 'react-intl';

export const useFormError = props => {
    const { errors } = props;
    const { formatMessage } = useIntl();

    const derivedErrorMessage = useMemo(() => {
        if (deriveErrorMessage(errors) === 'graphQLErrors') {
            return formatMessage({
                id: 'formError.errorMessage',
                defaultMessage:
                    'An error has occurred. Please check the input and try again.'
            });
        } else {
            return deriveErrorMessage(errors);
        }
    }, [errors]);

    return {
        errorMessage: derivedErrorMessage
    };
};
