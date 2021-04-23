import React from 'react';
import { Heart } from 'react-feather';
import { useGalleryButton } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
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
        successToastProps
    } = talonProps;

    useCommonToasts({ errorToastProps, loginToastProps, successToastProps });

    const classes = mergeClasses(defaultClasses, props.classes);
    const buttonClass = isSelected ? classes.root_selected : classes.root;

    return (
        <button className={buttonClass} {...buttonProps}>
            {HeartIcon}
        </button>
    );
};

export default GalleryButton;
