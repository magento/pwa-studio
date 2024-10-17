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
            var category = firstError.graphQLErrors?.find(
                extensions => extensions
            ).extensions?.category;
            category = category
                ? category
                      .split('-')
                      .map((word, index) =>
                          index === 0
                              ? word
                              : word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join('')
                : null;
            const errorId = category
                ? 'formError.' + category
                : 'formError.responseError';
            graphqlErrorMessage = formatMessage({
                id: errorId,
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
