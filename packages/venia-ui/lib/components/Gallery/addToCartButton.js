import React from 'react';
//import { shape, string, number } from 'prop-types';
//import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';
import { useScrollLock } from '@magento/peregrine';
//import Dialog from '../Dialog/dialog';
import Flag from 'react-feather'; 
import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './addToCartButton.css';

const addToCartIcon = <Icon size={20} src={Flag} />;

const GalleryButton = props => {
    const talonProps = useAddToCartButton(props);
    const {
        isOpen,
        isLoading,
        handleOpenDialog,
        handleCloseDialog,
        handleAddToCart
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
            <button onClick={handleAddToCart} disabled = {isLoading} >
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
