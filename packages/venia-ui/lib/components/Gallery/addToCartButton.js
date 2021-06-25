import React from 'react';
import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';
import { useScrollLock } from '@magento/peregrine';
import Flag from 'react-feather'; 
import { mergeClasses } from '../../classify';
import Icon from '../Icon';
//import defaultClasses from './addToCartButton.css';

const addToCartIcon = <Icon size={20} src={Flag} />;

const GalleryButton = props => {
    const talonProps = useAddToCartButton(props);
    const {
        isLoading,
        handleAddToCart
    } = talonProps;
    const classes = mergeClasses(defaultClasses, props.classes);

    const buttonProps = {
        onClick: handleAddToCart, 
        disabled: isLoading, 
    }
    //if selected 
    const buttonClass = isSelected ? classes.root_selected : classes.root; 

    return (
            <button onClick= {handleAddToCart} disabled={isLoading}>
                {addToCartIcon}
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
