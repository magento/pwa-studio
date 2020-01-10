import React from 'react';
import { useProduct } from '@magento/peregrine/lib/talons/ProductListing/useProduct';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import Kebab from '../MiniCart/kebab';
import ProductOptions from '../MiniCart/productOptions';
import Section from '../MiniCart/section';
import Image from '../Image';
import defaultClasses from './product.css';
import { REMOVE_ITEM_MUTATION } from './productListing';

const IMAGE_SIZE = 100;

const Product = props => {
    const { item } = props;
    const talonProps = useProduct({
        item,
        removeItemMutation: REMOVE_ITEM_MUTATION
    });
    const {
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        product
    } = talonProps;
    const { currency, image, name, options, quantity, unitPrice } = product;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <li className={classes.root}>
            <Image
                alt={name}
                classes={{ image: classes.image, root: classes.imageContainer }}
                width={IMAGE_SIZE}
                resource={image}
            />
            <span className={classes.name}>{name}</span>
            <ProductOptions
                options={options}
                classes={{ options: classes.options, optionLabel: {} }}
            />
            <span className={classes.price}>
                <Price currencyCode={currency} value={unitPrice} />
                {' ea.'}
            </span>
            {/** Quantity Selection to be completed by PWA-119. */}
            <div className={classes.quantity}>- {quantity} +</div>
            <Kebab classes={{ root: classes.kebab }}>
                <Section
                    text="Move to favorites"
                    onClick={handleToggleFavorites}
                    icon="Heart"
                    isFilled={false}
                    classes={{ text: classes.sectionText }}
                />
                <Section
                    text="Edit item"
                    onClick={handleEditItem}
                    icon="Edit2"
                    classes={{ text: classes.sectionText }}
                />
                <Section
                    text="Remove from cart"
                    onClick={handleRemoveFromCart}
                    icon="Trash"
                    classes={{ text: classes.sectionText }}
                />
            </Kebab>
        </li>
    );
};

export default Product;
