import React from 'react';
import { string, number, shape } from 'prop-types';

import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';
import { mergeClasses } from '../../classify';
import defaultClasses from './addToCartButton.css';
import Button from '../Button';
import { FormattedMessage } from 'react-intl';

const GalleryButton = props => {
    
    const talonProps = useAddToCartButton(props);
    const {
        isSelected,
        errorToastProps, // use commonToasts
        loginToastProps, 
        successToastProps, 
        isLoading,
        handleAddToCart
    } = talonProps;
    
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Button
            className={classes.root}
            type="button"
            priority="high"
            onClick={handleAddToCart}
            disabled ={isLoading}
        >
           ADD TO CART
        </Button>
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
