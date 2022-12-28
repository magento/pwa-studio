import React, { Fragment, useRef } from 'react';
import { element, func, shape, string } from 'prop-types';
import { Star } from 'react-feather';
import { useAddToListButton } from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/useAddToListButton';
import { useButton } from 'react-aria';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '../../Icon';
import WishlistDialog from '../WishlistDialog';
import defaultClasses from './addToListButton.module.css';
import { useCommonToasts } from './useCommonToasts';

const StarIcon = <Icon size={20} src={Star} />;

const AddToListButton = props => {
    const buttonRef = useRef();
    const talonProps = useAddToListButton(props);
    const {
        buttonProps,
        buttonText,
        errorToastProps,
        isSelected,
        loginToastProps,
        modalProps,
        successToastProps
    } = talonProps;

    useCommonToasts({ errorToastProps, loginToastProps, successToastProps });
    const { buttonProps: buttonAriaProps } = useButton(buttonProps, buttonRef);

    const multipleWishlistDialog = modalProps ? (
        <WishlistDialog {...modalProps} />
    ) : null;

    const classes = useStyle(defaultClasses, props.classes);
    const buttonClass = isSelected ? classes.root_selected : classes.root;

    return (
        <Fragment>
            <button
                ref={buttonRef}
                className={buttonClass}
                {...buttonAriaProps}
                data-cy="addToListButton-root"
            >
                {props.icon} {buttonText}
            </button>
            {multipleWishlistDialog}
        </Fragment>
    );
};

export default AddToListButton;

AddToListButton.defaultProps = {
    icon: StarIcon
};

AddToListButton.propTypes = {
    afterAdd: func,
    beforeAdd: func,
    classes: shape({
        root: string,
        root_selected: string
    }),
    icon: element
};
