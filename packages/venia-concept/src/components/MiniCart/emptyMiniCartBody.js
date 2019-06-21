import React from 'react';
import { func, string, shape } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Trigger from 'src/components/Trigger';

import defaultClasses from './emptyMiniCartBody.css';

const EmptyMiniCart = props => {
    const { closeDrawer } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h3 className={classes.emptyTitle}>
                There are no items in your shopping cart
            </h3>
            <Trigger action={closeDrawer}>
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
    }),
    closeDrawer: func
};

export default EmptyMiniCart;
