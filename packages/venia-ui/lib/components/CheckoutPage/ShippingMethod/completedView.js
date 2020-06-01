import React from 'react';
import { func, number, shape, string } from 'prop-types';
import { Edit2 as EditIcon } from 'react-feather';

import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import defaultClasses from './completedView.css';

const CompletedView = props => {
    const { selectedShippingMethod, showUpdateMode } = props;

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
        const { amount, method_title } = selectedShippingMethod;
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
            <div className={classes.container}>
                <span className={classes.titleContainer}>
                    <h5 className={classes.heading}>Shipping Method</h5>
                    <button
                        className={classes.editButton}
                        onClick={showUpdateMode}
                    >
                        <Icon size={16} src={EditIcon} />
                        <span className={classes.editButtonText}>{'Edit'}</span>
                    </button>
                </span>
                {contents}
            </div>
        </div>
    );
};

export default CompletedView;

CompletedView.propTypes = {
    classes: shape({
        button: string,
        container: string,
        contents: string,
        editButton: string,
        editButtonText: string,
        error: string,
        free: string,
        heading: string,
        root: string,
        titleContainer: string
    }),
    selectedShippingMethod: shape({
        amount: shape({
            currency: string,
            value: number
        }),
        carrier_code: string,
        carrier_title: string,
        method_code: string,
        method_title: string
    }),
    showUpdateMode: func
};
