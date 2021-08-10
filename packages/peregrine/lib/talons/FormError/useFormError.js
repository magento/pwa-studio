import { useMemo } from 'react';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';
import { useIntl } from 'react-intl';

export const useFormError = props => {
    const { errors } = props;
    const { formatMessage } = useIntl();

    const derivedErrorMessage = useMemo(() => {
        const defaultErrorMessage = formatMessage({
            id: 'formError.errorMessage',
            defaultMessage:
                'An error has occurred. Please check the input and try again.'
        });
        return deriveErrorMessage(errors, defaultErrorMessage);
    }, [errors, formatMessage]);

    return {
        errorMessage: derivedErrorMessage
    };
};
