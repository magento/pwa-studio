import React, { Fragment, useEffect } from 'react';
import { AlertCircle, Check, Heart, Info } from 'react-feather';
import { useToasts } from '@magento/peregrine';
import mergeClasses from '@magento/peregrine/lib/util/shallowMerge';
import { useGalleryButton } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton';

import Icon from '../../Icon';
import WishlistDialog from '../WishlistDialog';
import defaultClasses from './galleryButton.css';

const CheckIcon = <Icon size={20} src={Check} />;
const ErrorIcon = <Icon size={20} src={AlertCircle} />;
const HeartIcon = <Icon size={20} src={Heart} />;
const InfoIcon = <Icon size={20} src={Info} />;

const GalleryButton = props => {
    const talonProps = useGalleryButton(props);
    const {
        buttonProps,
        errorToastProps,
        isSelected,
        loginToastProps,
        modalProps,
        successToastProps
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (loginToastProps) {
            addToast({ ...loginToastProps, icon: InfoIcon });
        }
    }, [addToast, loginToastProps]);

    useEffect(() => {
        if (successToastProps) {
            addToast({ ...successToastProps, icon: CheckIcon });
        }
    }, [addToast, successToastProps]);

    useEffect(() => {
        if (errorToastProps) {
            addToast({ ...errorToastProps, icon: ErrorIcon });
        }
    }, [addToast, errorToastProps]);

    const multipleWishlistDialog = modalProps ? (
        <WishlistDialog {...modalProps} />
    ) : null;

    const buttonClass = isSelected ? classes.root_selected : classes.root;

    return (
        <Fragment>
            <button className={buttonClass} {...buttonProps}>
                {HeartIcon}
            </button>
            {multipleWishlistDialog}
        </Fragment>
    );
};

export default GalleryButton;
