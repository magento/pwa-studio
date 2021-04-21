import React, { Fragment } from 'react';
import { Heart } from 'react-feather';
import mergeClasses from '@magento/peregrine/lib/util/shallowMerge';
import { useGalleryButton } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton';

import Icon from '../../Icon';
import WishlistDialog from '../WishlistDialog';
import defaultClasses from './galleryButton.css';
import { useCommonToasts } from './useCommonToasts';

const HeartIcon = <Icon size={20} src={Heart} />;

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

    useCommonToasts({ errorToastProps, loginToastProps, successToastProps });

    const multipleWishlistDialog = modalProps ? (
        <WishlistDialog {...modalProps} />
    ) : null;

    const classes = mergeClasses(defaultClasses, props.classes);
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
