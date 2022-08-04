import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Image from '@magento/venia-ui/lib/components/Image';
import { Trash2 } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Price } from '@magento/peregrine';
import AddToCartbutton from '@magento/venia-ui/lib/components/Gallery/addToCartButton';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import { FormattedMessage } from 'react-intl';

import defaultClasses from './ProductCard.module.css';

const ProductCard = ({ item, deleteProduct }) => {
    const { name, price_range } = item.product;
    const { minimum_price } = price_range;
    const { final_price, regular_price } = minimum_price;
    const classes = useStyle(defaultClasses);
    const imageProps = {
        alt: name,
        src: item.product.small_image.url,
        width: 400
    };
    const price =
        final_price.value === regular_price.value ? (
            <Price currencyCode={minimum_price?.regular_price.currency} value={minimum_price?.regular_price.value} />
        ) : (
            <div className={classes.priceWrapper}>
                <div className={classes.oldPrice}>
                    <Price value={regular_price.value} currencyCode={regular_price.currency} />
                </div>
                <div className={`${classes.price} ${classes.newPrice}`}>
                    <Price value={final_price.value} currencyCode={final_price.currency} />
                </div>
            </div>
        );
    const addToCart = <AddToCartbutton item={item.product} urlSuffix={item.product.url_suffix} />;

    return (
        <div className={classes.root} data-cy="compareProducts-root">
            <Image {...imageProps} />
            <div className={classes.actionWrap}>
                <span className={classes.name} data-cy="compareProducts-productName">
                    {name}
                </span>{' '}
                <button
                    className={classes.deleteItem}
                    onClick={() => deleteProduct(item)}
                    data-cy="compareProducts-deleteItem"
                >
                    <Icon size={16} src={Trash2} />
                </button>
            </div>
            <div className={classes.priceContainer} data-cy="compareProducts-priceContainer">
                {price}
            </div>
            <div className={classes.actionsContainer}>
                {addToCart}
                <WishlistGalleryButton item={{ sku: item.product.sku, quantity: 1 }} />
            </div>
        </div>
    );
};

export default ProductCard;
