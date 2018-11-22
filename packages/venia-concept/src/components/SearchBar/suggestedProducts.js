import React from 'react';
import { List } from '@magento/peregrine';
import SuggestedProduct from './suggestedProduct';
import classify from 'src/classify';

import defaultClasses from './suggestedProducts.css';

const SuggestedProducts = ({ classes, items, handleOnProductOpen }) => (
    <div className={classes.root}>
        <h4 className={classes.title}>
            <span className={classes.titleText}>Product Suggestions</span>
        </h4>
        <List
            render="ul"
            className={classes.items}
            items={items}
            getItemKey={item => item.id}
            renderItem={props => (
                <SuggestedProduct
                    handleOnProductOpen={handleOnProductOpen}
                    {...props.item}
                />
            )}
        />
    </div>
);

export default classify(defaultClasses)(SuggestedProducts);
