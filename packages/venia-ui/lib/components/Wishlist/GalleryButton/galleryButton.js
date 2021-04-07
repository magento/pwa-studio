import React, { Fragment, useEffect } from 'react';
import { Check, Heart, Info } from 'react-feather';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';
import mergeClasses from '@magento/peregrine/lib/util/shallowMerge';
import { useGalleryButton } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton';

import Icon from '../../Icon';
import defaultClasses from './galleryButton.css';
import WishlistDialog from '../WishlistDialog';

const CheckIcon = <Icon size={20} src={Check} />;
const HeartIcon = <Icon size={20} src={Heart} />;
const InfoIcon = <Icon size={20} src={Info} />;

const GalleryButton = props => {
    const talonProps = useGalleryButton(props);
    const {
        getModalProps,
        getSuccessToastProps,
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
        if (getSuccessToastProps) {
            addToast(getSuccessToastProps({ icon: CheckIcon }));
        }
    }, [
        addToast,
        formatMessage,
        getSuccessToastProps,
        showLoginToast,
        showSuccessToast
    ]);

    const multipleWishlistDialog = getModalProps ? (
        <WishlistDialog {...getModalProps()} />
    ) : null;

    const buttonClass =
        isLoading || isSelected ? classes.root_selected : classes.root;

    return (
        <Fragment>
            <button
                className={buttonClass}
                disabled={isLoading || isSelected}
                onClick={handleClick}
                type="button"
            >
                {HeartIcon}
            </button>
            {multipleWishlistDialog}
        </Fragment>
    );
};

export default GalleryButton;
