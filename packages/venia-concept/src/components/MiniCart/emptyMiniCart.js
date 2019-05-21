import React from 'react';
import { string, shape } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Trigger from './trigger';
import defaultClasses from './emptyMiniCart.css';

const EmptyMiniCart = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h3 className={classes.emptyTitle}>
                There are no items in your shopping cart
            </h3>
            <Trigger>
                <span className={classes.continue}>Continue Shopping</span>
            </Trigger>
        </div>
    );
};

EmptyMiniCart.propTypes = {
    classes: shape({
        root: string,
        emptyTitle: string,
        continue: string
    })
};

export default EmptyMiniCart;
