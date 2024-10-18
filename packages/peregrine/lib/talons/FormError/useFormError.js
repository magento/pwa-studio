import { useMemo } from 'react';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';
import { useIntl } from 'react-intl';

export const useFormError = props => {
    const { errors, allowErrorMessages } = props;
    const { formatMessage } = useIntl();

    const derivedErrorMessage = useMemo(() => {
        const defaultErrorMessage = allowErrorMessages
            ? ''
            : formatMessage({
                  id: 'formError.errorMessage',
                  defaultMessage:
                      'An error has occurred. Please check the input and try again.'
              });

        const firstError = errors
            .filter(error => error !== null || undefined)
            .map(error => (Array.isArray(error) ? error[0] : error))
            .find(message => message);
        var graphqlErrorMessage;

        if (firstError) {
            graphqlErrorMessage = formatMessage({
                id: 'formError.responseError',
                defaultMessage: firstError.message
            });
        }

        return graphqlErrorMessage
            ? deriveErrorMessage(errors, graphqlErrorMessage)
            : deriveErrorMessage(errors, defaultErrorMessage);
    }, [errors, formatMessage, allowErrorMessages]);

    return {
        errorMessage: derivedErrorMessage
    };
};
