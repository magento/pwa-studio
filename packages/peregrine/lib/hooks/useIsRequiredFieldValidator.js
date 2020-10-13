import { useIntl } from 'react-intl';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

/**
 * A hook that will return translated validation messaging for required fields
 *
 * @returns {Function} returns the translated message
 */
export const useIsRequiredFieldValidator = () => {
    const { formatMessage } = useIntl();

    const message = formatMessage({
        id: 'validation.isRequired',
        defaultValue: 'Is required.'
    });

    return (...args) => {
        return isRequired(...args, message);
    };
};
