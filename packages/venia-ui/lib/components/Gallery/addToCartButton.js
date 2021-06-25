import React from 'react';
//import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';
//import { useScrollLock } from '@magento/peregrine';
import Button from '../Button';
import { mergeClasses } from '../../classify';
import defaultClasses from './addToCartButton.css';

const GalleryButton = props => {
    //const talonProps = useAddToCartButton(props);
    const {
        isLoading,
        handleAddToCart
    } = talonProps;
    const classes = mergeClasses(defaultClasses, props.classes);
    const buttonClass = isSelected? classes.root_selected : classes.root; 

    return (
            <Button 
            className = {buttonClass}
            type="button">
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
