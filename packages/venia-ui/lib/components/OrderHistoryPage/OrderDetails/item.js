import React, { useMemo } from 'react';
import { shape, string, number, arrayOf } from 'prop-types';

import { Link, resourceUrl } from '@magento/venia-drivers';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Button from '../../Button';
import ProductOptions from '../../LegacyMiniCart/productOptions';
import Image from '../../Image';

import defaultClasses from './item.css';

const Item = props => {
    const {
        product_name,
        product_sale_price,
        quantity_ordered,
        selected_options,
        thumbnail,
        url_key,
        url_suffix
    } = props;
    const { url } = thumbnail;
    const itemLink = useMemo(() => resourceUrl(`/${url_key}${url_suffix}`), [
        url_key,
        url_suffix
    ]);
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
                    resource={url}
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
            <span
                className={classes.quantity}
            >{`Qty : ${quantity_ordered}`}</span>
            <span className={classes.price}>{product_sale_price}</span>
            <Button onClick={() => {}} className={classes.buyAgainButton}>
                {'Buy Again'}
            </Button>
            <Button onClick={() => {}} className={classes.returnThisButton}>
                {'Return This'}
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
    product_name: string,
    product_sale_price: string,
    quantity_ordered: number,
    selected_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ),
    thumbnail: shape({
        url: string
    }),
    url_key: string,
    url_suffix: string
};
