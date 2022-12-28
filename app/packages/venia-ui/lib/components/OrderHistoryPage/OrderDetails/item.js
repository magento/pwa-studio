import React, { useMemo } from 'react';
import { shape, string, number, arrayOf } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useOrderHistoryContext } from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';

import { useStyle } from '@magento/venia-ui/lib/classify';

import Image from '../../Image';
import Price from '../../Price';
import defaultClasses from './item.module.css';
import PlaceholderImage from '../../Image/placeholderImage';
const Item = props => {
    const {
        index,
        product_name,
        product_sale_price,
        product_url_key,
        quantity_ordered,
        selected_options,
        thumbnail
    } = props;

    const orderHistoryState = useOrderHistoryContext();
    const { productURLSuffix } = orderHistoryState;
    const itemLink = `${product_url_key}${productURLSuffix}`;
    const mappedOptions = useMemo(() => selected_options.map(option => option.value), [selected_options]);
    const classes = useStyle(defaultClasses, props.classes);

    const thumbnailProps = {
        alt: product_name,
        classes: { root: classes.thumbnail },
        width: 87,
        height: 70
    };
    const thumbnailElement = thumbnail ? (
        <Image {...thumbnailProps} resource={thumbnail.url} />
    ) : (
        <PlaceholderImage {...thumbnailProps} />
    );

    return (
        <>
            <tr className={classes.tableRow}>
                <td>{index + 1}</td>
                <td>
                    <Link className={classes.thumbnailContainer} to={itemLink}>
                        <span className={classes.nameProduct}>
                            {thumbnailElement}
                            {product_name} {mappedOptions.join(', ')}
                        </span>
                    </Link>
                </td>
                <td>{mappedOptions[0]}</td>
                <td>
                    {quantity_ordered + ' '}
                    <FormattedMessage id="orderDetails.items" defaultMessage="items" />
                </td>
                <td>
                    <Price value={product_sale_price.value} currencyCode={product_sale_price.currency} />
                </td>
                <td className={classes.grossPrice}>
                    <Price value={product_sale_price.value} currencyCode={product_sale_price.currency} />
                </td>
            </tr>
        </>
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
        buyAgainButton: string
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
