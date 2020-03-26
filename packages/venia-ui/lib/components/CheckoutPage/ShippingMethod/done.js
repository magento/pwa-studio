import React from 'react';
import { Edit2 as EditIcon } from 'react-feather';

import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import defaultClasses from './done.css';

const editIconAttrs = {
    color: 'black',
    width: 18
};

const Done = props => {
    const { selectedShippingMethod, shippingMethods, showEditMode } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    let contents;
    if (!selectedShippingMethod) {
        // Error state.
        contents = (
            <span className={classes.error}>
                {`Error loading selected shipping method. Please select again.`}
            </span>
        );
    } else {
        const selectedShippingMethodObject = shippingMethods.find(method => {
            return selectedShippingMethod === method.serializedValue;
        });
        const { amount, method_title } = selectedShippingMethodObject;
        const { currency, value } = amount;

        const priceElement = value ? (
            <div>
                <Price value={value} currencyCode={currency} />
            </div>
        ) : (
            <span className={classes.free}>Free</span>
        );

        contents = (
            <div className={classes.contents}>
                <span>{method_title}</span>
                {priceElement}
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <button className={classes.button} onClick={showEditMode}>
                <div className={classes.container}>
                    <span className={classes.title_container}>
                        <h5 className={classes.heading}>Shipping Method</h5>
                        <Icon src={EditIcon} attrs={editIconAttrs} />
                    </span>
                    {contents}
                </div>
            </button>
        </div>
    );
};

export default Done;
