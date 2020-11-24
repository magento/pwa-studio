import React, { useMemo } from 'react';
import { shape, arrayOf, string, number } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Item from './item';

import defaultClasses from './items.css';
import { FormattedMessage } from 'react-intl';

const Items = props => {
    const { items, imagesData } = props.data;
    const classes = mergeClasses(defaultClasses, props.classes);

    const mappedImagesData = useMemo(() => {
        const mappedImagesData = {};

        imagesData.forEach(imageData => {
            mappedImagesData[imageData.url_key] = imageData;
        });

        return mappedImagesData;
    }, [imagesData]);

    const itemsComponent = items.map(item => (
        <Item
            key={item.id}
            {...item}
            {...mappedImagesData[item.product_url_key]}
        />
    ));

    return (
        <div className={classes.root}>
            <h3 className={classes.heading}>
                <FormattedMessage
                    id="orderItems.itemsHeading"
                    defaultMessage="Items"
                />
            </h3>
            <div className={classes.itemsContainer}>{itemsComponent}</div>
        </div>
    );
};

export default Items;

Items.propTypes = {
    classes: shape({
        root: string
    }),
    data: shape({
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                product_url_key: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        imagesData: arrayOf(
            shape({
                id: number,
                sku: string,
                thumbnail: shape({
                    url: string
                }),
                url_key: string,
                url_suffix: string
            })
        )
    })
};
