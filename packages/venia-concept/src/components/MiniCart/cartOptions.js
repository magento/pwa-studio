import React, { Suspense, useCallback, useState } from 'react';
import { array, bool, func, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Price } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import LoadingIndicator, {
    loadingIndicator
} from 'src/components/LoadingIndicator';
import Button from 'src/components/Button';
import Quantity from 'src/components/ProductQuantity';
import appendOptionsToPayload from 'src/util/appendOptionsToPayload';
import isProductConfigurable from 'src/util/isProductConfigurable';

import defaultClasses from './cartOptions.css';

// TODO: get real currencyCode for cartItem
const currencyCode = 'USD';

const Options = React.lazy(() => import('../ProductOptions'));

const getIsMissingOptions = (cartItem, configItem, numSelections) => {
    // Non-configurable products can't be missing options
    if (cartItem.product_type !== 'configurable') {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = configItem;
    const numProductOptions = configurable_options.length;

    return numSelections < numProductOptions;
};

const CartOptions = props => {
    // Props.
    const {
        cartItem,
        configItem,
        endEditItem,
        isUpdatingItem,
        updateCart
    } = props;
    const { name, price, qty } = cartItem;

    // State.
    const [optionSelections, setOptionSelections] = useState(new Map());
    const [quantity, setQuantity] = useState(qty);

    // Callbacks.
    const handleOptionsSelectionsChangeed = useCallback(
        (optionId, selection) => {
            setOptionSelections(
                new Map(
                    optionSelections.set(optionId, Array.from(selection).pop())
                )
            );
        },
        [optionSelections, setOptionSelections]
    );
    const handleQuantityValueChanged = useCallback(
        newQuantity => {
            setQuantity(newQuantity);
        },
        [setQuantity]
    );
    const handleUpdateButtonClicked = useCallback(() => {
        const payload = {
            item: configItem,
            productType: configItem.__typename,
            quantity: quantity
        };

        if (isProductConfigurable(configItem)) {
            appendOptionsToPayload(payload, optionSelections);
        }

        updateCart(payload, cartItem.item_id);
    });

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const isMissingOptions = getIsMissingOptions(
        cartItem,
        configItem,
        optionSelections.size
    );
    const modalClass = isUpdatingItem ? classes.modal_active : classes.modal;

    // Render.
    const options = isProductConfigurable(configItem) ? (
        <Suspense fallback={loadingIndicator}>
            <section className={classes.options}>
                <Options
                    options={configItem.configurable_options}
                    onSelectionChange={handleOptionsSelectionsChangeed}
                />
            </section>
        </Suspense>
    ) : null;

    return (
        <Form className={classes.root}>
            <div className={classes.focusItem}>
                <span className={classes.name}>{name}</span>
                <span className={classes.price}>
                    <Price currencyCode={currencyCode} value={price} />
                </span>
            </div>
            <div className={classes.form}>
                {options}
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>
                        <span>Quantity</span>
                    </h2>
                    <Quantity
                        initialValue={qty}
                        onValueChange={handleQuantityValueChanged}
                    />
                </section>
            </div>
            <div className={classes.save}>
                <Button onClick={endEditItem}>
                    <span>Cancel</span>
                </Button>
                <Button
                    priority="high"
                    onClick={handleUpdateButtonClicked}
                    disabled={isMissingOptions}
                >
                    <span>Update Cart</span>
                </Button>
            </div>
            <div className={modalClass}>
                <LoadingIndicator>Updating Cart</LoadingIndicator>
            </div>
        </Form>
    );
};

CartOptions.propTypes = {
    classes: shape({
        root: string,
        focusItem: string,
        price: string,
        form: string,
        quantity: string,
        quantityTitle: string,
        save: string,
        modal: string,
        modal_active: string,
        options: string
    }),
    cartItem: shape({
        item_id: number.isRequired,
        name: string.isRequired,
        price: number.isRequired,
        qty: number.isRequired
    }),
    configItem: shape({
        __typename: string,
        configurable_options: array
    }).isRequired,
    endEditItem: func.isRequired,
    isUpdatingItem: bool,
    updateCart: func.isRequired
};

export default CartOptions;
