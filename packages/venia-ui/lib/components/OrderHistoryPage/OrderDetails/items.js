import React, { useMemo } from 'react';

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
