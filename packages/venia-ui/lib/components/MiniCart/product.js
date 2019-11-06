import React, { useMemo } from 'react';
import { array, func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../classify';

import { Image, UNCONSTRAINED_SIZE_KEY } from '../Image';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';

import Kebab from './kebab';
import ProductOptions from './productOptions';
import Section from './section';

import defaultClasses from './product.css';
import { useProduct } from '@magento/peregrine/lib/talons/MiniCart/useProduct';

const PRODUCT_IMAGE_WIDTHS = new Map().set(UNCONSTRAINED_SIZE_KEY, 80);

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
            imageProps.width = PRODUCT_IMAGE_WIDTHS.get(UNCONSTRAINED_SIZE_KEY);
        } else {
            imageProps.resource = image.file;
            imageProps.widths = PRODUCT_IMAGE_WIDTHS;
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
