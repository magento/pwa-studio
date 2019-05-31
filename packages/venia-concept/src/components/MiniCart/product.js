import React, { useCallback, useEffect, useRef, useState } from 'react';
import { array, func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import { resourceUrl } from 'src/drivers';

import Kebab from './kebab';
import ProductOptions from './productOptions';
import Section from './section';

import defaultClasses from './product.css';

const FAVORITES_FILL = { fill: 'rgb(var(--venia-teal))' };

const Product = props => {
    const { beginEditItem, currencyCode, item, removeItemFromCart } = props;
    const { image, name, options, price, qty } = item;

    const imageRef = useRef(null);
    const [imageSource, setImageSource] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const classes = mergeClasses(defaultClasses, props.classes);
    const mask = isLoading ? <div className={classes.mask} /> : null;

    useEffect(() => {
        // After the imageRef mounts, get its --image-width so
        // we can pass it to `resourceUrl`.
        const imageWidth = getComputedStyle(imageRef.current).getPropertyValue(
            '--image-width'
        );

        if (imageWidth) {
            // parseFloat to strip off any units like 'px'.
            const parsedImageWidth = parseFloat(imageWidth);
            setImageSource(
                `${resourceUrl(image.file, {
                    type: 'image-product',
                    width: parsedImageWidth
                })}`
            );
        }
    }, [imageRef]);

    const handleFavoriteItem = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite, setIsFavorite]);
    const handleEditItem = useCallback(() => {
        beginEditItem(item);
    }, [beginEditItem, item]);
    const handleRemoveItem = useCallback(() => {
        setIsLoading(true);

        // TODO: prompt user to confirm this action?
        removeItemFromCart({ item });
    }, [item, removeItemFromCart, setIsLoading]);

    return (
        <li className={classes.root}>
            <img
                alt={name}
                className={classes.image}
                ref={imageRef}
                src={imageSource}
            />
            <div className={classes.name}>{name}</div>
            <ProductOptions options={options} />
            <div className={classes.quantity}>
                <div className={classes.quantityRow}>
                    <span>{qty}</span>
                    <span className={classes.quantityOperator}>{'×'}</span>
                    <span className={classes.price}>
                        <Price currencyCode={currencyCode} value={price} />
                    </span>
                </div>
            </div>
            {mask}
            <Kebab>
                <Section
                    text="Add to favorites"
                    onClick={handleFavoriteItem}
                    icon="Heart"
                    iconAttributes={isFavorite ? FAVORITES_FILL : {}}
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
            file: string.isRequired
        }).isRequired,
        name: string,
        options: array,
        price: number,
        qty: number
    }).isRequired,
    removeItemFromCart: func.isRequired
};

export default Product;
