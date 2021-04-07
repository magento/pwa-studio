import React, { useEffect } from 'react';
import { Check, Heart, Info } from 'react-feather';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';
import mergeClasses from '@magento/peregrine/lib/util/shallowMerge';
import { useGalleryButton } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton';

import Icon from '../../Icon';
import defaultClasses from './galleryButton.css';

const CheckIcon = <Icon size={20} src={Check} />;
const HeartIcon = <Icon size={20} src={Heart} />;
const InfoIcon = <Icon size={20} src={Info} />;

const GalleryButton = props => {
    const talonProps = useGalleryButton(props);
    const {
        handleClick,
        isLoading,
        isSelected,
        showLoginToast,
        showSuccessToast
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (showLoginToast) {
            addToast({
                type: 'info',
                icon: InfoIcon,
                message: formatMessage({
                    id: 'wishlist.galleryButton.loginMessage',
                    defaultMessage:
                        'Please sign-in to your Account to save items for later.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, showLoginToast]);

    useEffect(() => {
        if (showSuccessToast) {
            addToast({
                type: 'success',
                icon: CheckIcon,
                message: formatMessage({
                    id: 'wishlist.galleryButton.successMessage',
                    defaultMessage:
                        'Item successfully added to the "My Favorites" list.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, showLoginToast, showSuccessToast]);

    const buttonClass =
        isLoading || isSelected ? classes.root_selected : classes.root;

    return (
        <button
            className={buttonClass}
            disabled={isLoading || isSelected}
            onClick={handleClick}
            type="button"
        >
            {HeartIcon}
        </button>
    );
};

export default GalleryButton;
