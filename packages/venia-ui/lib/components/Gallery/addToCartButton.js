import React from 'react';
//import { useScrollLock } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import defaultClasses from './addToCartButton.css';

const GalleryButton = props => {
    /*
    //const talonProps = useAddToCartButton(props);
    const {
        isSelected,
        errorToastProps, // use commonToasts
        loginToastProps, 
        successToastProps, 
        isLoading,
        handleAddToCart
    } = talonProps;
    */
    const classes = mergeClasses(defaultClasses, props.classes);
    const handleOnClick = () => { }

    return (
        <button
            className={classes.root}
            type="button"
            onClick={handleOnClick}
        >
            ADD TO CART
        </button>
    );
};

export default GalleryButton;

GalleryButton.propTypes = {
    classes: shape({
        root: string,
        root_selected: string
    }),
    item: shape({
        id: number.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        url_key: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    })
};
