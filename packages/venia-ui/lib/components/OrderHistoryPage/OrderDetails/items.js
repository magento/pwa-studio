import React, { useMemo } from 'react';
import { shape, arrayOf, string, number } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Item from './item';

import defaultClasses from './items.css';

const Items = props => {
    const { items, imagesData } = props.data;
    const classes = mergeClasses(defaultClasses, props.classes);

    const mappedImagesData = useMemo(() => {
        const mappedImagesData = {};

        imagesData.forEach(imageData => {
            mappedImagesData[imageData.sku] = imageData;
        });

        return mappedImagesData;
    }, [imagesData]);

    const itemsComponent = items.map(item => (
        <Item
            key={item.id}
            {...{ ...item, ...mappedImagesData[item.product_sku] }}
        />
    ));

    return <div className={classes.root}>{itemsComponent}</div>;
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
                product_sale_price: string,
                product_sku: string,
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
