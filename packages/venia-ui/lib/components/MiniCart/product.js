import React, { useMemo } from 'react';
import { array, func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../classify';

import Image from '../Image';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';

import Kebab from './kebab';
import ProductOptions from './productOptions';
import Section from './section';

import defaultClasses from './product.css';
import { useProduct } from '@magento/peregrine/lib/talons/MiniCart/useProduct';

// Note: these two currently have the same value but they're not the same thing.
// They are separate to indicate that they can be changed independently.
const PRODUCT_IMAGE_RESOURCE_WIDTH = 80;
// Should be kept in sync with product.css .image max-width.
const PRODUCT_IMAGE_SIZES = '80px';

const Product = props => {
    const { beginEditItem, currencyCode, item, removeItemFromCart } = props;

    const talonProps = useProduct({
        beginEditItem,
        item,
        removeItemFromCart
    });

    const {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        hasImage,
        isFavorite,
        isLoading,
        productName,
        productOptions,
        productPrice,
        productQuantity
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const { image } = item;

    const productImage = useMemo(() => {
        const imageProps = {
            alt: productName,
            classes: { image: classes.image, root: classes.imageContainer }
        };

        if (!hasImage) {
            imageProps.src = transparentPlaceholder;
        } else {
            imageProps.resource = image.file;
            imageProps.resourceWidth = PRODUCT_IMAGE_RESOURCE_WIDTH;
            imageProps.sizes = PRODUCT_IMAGE_SIZES;
        }

        return <Image {...imageProps} />;
    }, [
        classes.image,
        classes.imageContainer,
        hasImage,
        image.file,
        productName
    ]);

    const mask = isLoading ? <div className={classes.mask} /> : null;

    return (
        <li className={classes.root}>
            {productImage}
            <div className={classes.name}>{productName}</div>
            <ProductOptions options={productOptions} />
            <div className={classes.quantity}>
                <div className={classes.quantityRow}>
                    <span>{productQuantity}</span>
                    <span className={classes.quantityOperator}>{'×'}</span>
                    <span className={classes.price}>
                        <Price
                            currencyCode={currencyCode}
                            value={productPrice}
                        />
                    </span>
                </div>
            </div>
            {mask}
            <Kebab>
                <Section
                    text="Add to favorites"
                    onClick={handleFavoriteItem}
                    icon="Heart"
                    isFilled={isFavorite}
                />
                <Section
                    text="Edit item"
                    onClick={handleEditItem}
                    icon="Edit2"
                />
                <Section
                    text="Remove item"
                    onClick={handleRemoveItem}
                    icon="Trash"
                />
            </Kebab>
        </li>
    );
};

Product.propTypes = {
    beginEditItem: func.isRequired,
    currencyCode: string,
    item: shape({
        image: shape({
            file: string
        }),
        name: string,
        options: array,
        price: number,
        qty: number
    }).isRequired,
    removeItemFromCart: func.isRequired
};

export default Product;
