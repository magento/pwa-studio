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

const Options = React.lazy(() => import('../ProductOptions'));

const isItemMissingOptions = (cartItem, configItem, numSelections) => {
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
        currencyCode,
        endEditItem,
        isUpdatingItem,
        updateCart
    } = props;
    const { name, price, qty } = cartItem;

    // State.
    const [optionSelections, setOptionSelections] = useState(new Map());
    const [quantity, setQuantity] = useState(qty);

    // Callbacks.
    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            setOptionSelections(
                new Map(optionSelections).set(
                    optionId,
                    Array.from(selection).pop()
                )
            );
        },
        [optionSelections]
    );
    const handleUpdateClick = useCallback(() => {
        const payload = {
            item: configItem,
            productType: configItem.__typename,
            quantity: quantity
        };

        if (isProductConfigurable(configItem)) {
            appendOptionsToPayload(payload, optionSelections);
        }

        updateCart(payload, cartItem.item_id);
    }, [cartItem, configItem, quantity, optionSelections, updateCart]);

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const isMissingOptions = isItemMissingOptions(
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
                    onSelectionChange={handleSelectionChange}
                    product={configItem}
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
                    <Quantity initialValue={qty} onValueChange={setQuantity} />
                </section>
            </div>
            <div className={classes.save}>
                <Button onClick={endEditItem}>
                    <span>Cancel</span>
                </Button>
                <Button
                    priority="high"
                    onClick={handleUpdateClick}
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
    cartItem: shape({
        item_id: number.isRequired,
        name: string.isRequired,
        price: number.isRequired,
        qty: number.isRequired
    }),
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
    configItem: shape({
        __typename: string,
        configurable_options: array
    }).isRequired,
    currencyCode: string,
    endEditItem: func.isRequired,
    isUpdatingItem: bool,
    updateCart: func.isRequired
};

export default CartOptions;
