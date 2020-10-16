import React, { useMemo } from 'react';
import { shape, string, number, arrayOf } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '../../Button';
import ProductOptions from '../../LegacyMiniCart/productOptions';
import Image from '../../Image';
import Price from '../../Price';
import defaultClasses from './item.css';

const Item = props => {
    const {
        product_name,
        product_sale_price,
        product_url_key,
        quantity_ordered,
        selected_options,
        thumbnail
    } = props;
    const { currency, value: unitPrice } = product_sale_price;

    // TODO: do not hard code url key suffix; doesn't appear available from GraphQL
    const itemLink = `${product_url_key}.html`;
    const mappedOptions = useMemo(
        () =>
            selected_options.map(option => ({
                option_label: option.label,
                value_label: option.value
            })),
        [selected_options]
    );
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Link className={classes.thumbnailContainer} to={itemLink}>
                <Image
                    alt={product_name}
                    classes={{ root: classes.thumbnail }}
                    width={50}
                    resource={thumbnail.url}
                />
            </Link>
            <Link className={classes.name} to={itemLink}>
                {product_name}
            </Link>
            <ProductOptions
                options={mappedOptions}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>
                <FormattedMessage
                    id="orderDetails.quantity"
                    values={{
                        quantity: quantity_ordered
                    }}
                />
            </span>
            <div className={classes.price}>
                <Price currencyCode={currency} value={unitPrice} />
            </div>
            <Button
                onClick={() => {
                    // TODO will be implemented in PWA-979
                    console.log('Buying Again');
                }}
                className={classes.buyAgainButton}
            >
                <FormattedMessage
                    id="orderDetails.buyAgain"
                    defaultMessage="Buy Again"
                />
            </Button>
            <Button
                onClick={() => {
                    // TODO will be implemented in PWA-979
                    console.log('Returning the Item');
                }}
                className={classes.returnThisButton}
            >
                <FormattedMessage
                    id="orderDetails.returnThis"
                    defaultMessage="Return This"
                />
            </Button>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnailContainer: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        buyAgainButton: string,
        returnThisButton: string
    }),
    product_name: string.isRequired,
    product_sale_price: shape({
        currency: string,
        value: number
    }).isRequired,
    product_url_key: string.isRequired,
    quantity_ordered: number.isRequired,
    selected_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ).isRequired,
    thumbnail: shape({
        url: string
    })
};
