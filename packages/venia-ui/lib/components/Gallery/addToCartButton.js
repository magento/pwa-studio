import Button from '../Button';
import defaultClasses from './addToCartButton.css';
import { mergeClasses } from '../../classify';
import React from 'react';
import { string, number, shape } from 'prop-types';
import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';

const GalleryButton = props => {
    
    const talonProps = useAddToCartButton(props);
    const {
        handleAddToCart,
        isDisabled,
        isInStock
         
    } = talonProps;
    
    const classes = mergeClasses(defaultClasses, props.classes);
    const buttonText = isInStock ? "ADD TO CART" : "OUT OF STOCK"; 

    return (
        <Button
            className={classes.root}
            disabled ={isDisabled}
            onClick={handleAddToCart}
            priority="high"
            type="button"
        >
           {buttonText}
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
