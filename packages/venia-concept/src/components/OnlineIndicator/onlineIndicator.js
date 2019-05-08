import { useEffect } from 'react';
import { useToastActions } from '@magento/peregrine/src/Toasts/useToastActions';

import CloudOffIcon from 'react-feather/dist/icons/cloud-off';
import CheckIcon from 'react-feather/dist/icons/check';
import { bool, shape, string } from 'prop-types';

const OnlineIndicator = props => {
    const { addToast } = useToastActions();
    const { isOnline } = props;

    useEffect(() => {
        if (isOnline) {
            addToast({
                type: 'info',
                icon: CheckIcon,
                message: 'You are online.'
            });
        } else {
            addToast({
                type: 'error',
                icon: CloudOffIcon,
                message: 'You are offline. Some features may be unavailable.'
            });
        }
    }, [isOnline]);

    return null;
};

OnlineIndicator.propTypes = {
    classes: shape({
        root: string
    }),
    isOnline: bool
};

export default OnlineIndicator;
