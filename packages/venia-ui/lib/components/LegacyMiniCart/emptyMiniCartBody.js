import React from 'react';
import { func, string, shape } from 'prop-types';

import { mergeClasses } from '../../classify';

import defaultClasses from './emptyMiniCartBody.css';
import { useEmptyMiniCart } from '@magento/peregrine/lib/talons/LegacyMiniCart/useEmptyMiniCart';
import Button from '../Button';

const EmptyMiniCart = props => {
    const { closeDrawer } = props;

    const talonProps = useEmptyMiniCart({
        closeDrawer
    });

    const { handleClick } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h3 className={classes.emptyTitle}>
                There are no items in your shopping cart
            </h3>
            <Button priority={'normal'} type={'button'} onClick={handleClick}>
                Continue Shopping
            </Button>
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
