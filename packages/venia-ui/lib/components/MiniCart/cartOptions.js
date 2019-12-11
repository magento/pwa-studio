import React, { Suspense } from 'react';
import { array, bool, func, number, shape, string } from 'prop-types';
import { Form } from 'informed';

import { Price } from '@magento/peregrine';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useCartOptions } from '@magento/peregrine/lib/talons/MiniCart/useCartOptions';

import { mergeClasses } from '../../classify';
import LoadingIndicator from '../LoadingIndicator';
import Button from '../Button';
import Quantity from '../ProductQuantity';
import ADD_CONFIGURABLE_MUTATION from '../../queries/addConfigurableProductsToCart.graphql';
import ADD_SIMPLE_MUTATION from '../../queries/addSimpleProductsToCart.graphql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import UPDATE_ITEM_MUTATION from '../../queries/updateItemInCart.graphql';

import defaultClasses from './cartOptions.css';

const Options = React.lazy(() => import('../ProductOptions'));

const loadingIndicator = (
    <LoadingIndicator>
        <span>{'Fetching Options...'}</span>
    </LoadingIndicator>
);

const CartOptions = props => {
    const {
        cartItem,
        configItem,
        currencyCode,
        endEditItem,
        isUpdatingItem
    } = props;

    const talonProps = useCartOptions({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        cartItem,
        configItem,
        createCartMutation: CREATE_CART_MUTATION,
        endEditItem,
        updateItemMutation: UPDATE_ITEM_MUTATION
    });

    const {
        itemName,
        itemPrice,
        initialQuantity,
        handleCancel,
        handleSelectionChange,
        handleUpdate,
        handleValueChange,
        isUpdateDisabled
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const modalClass = isUpdatingItem ? classes.modal_active : classes.modal;

    const options = isProductConfigurable(configItem) ? (
        <Suspense fallback={loadingIndicator}>
            <section className={classes.options}>
                <Options
                    onSelectionChange={handleSelectionChange}
                    options={configItem.configurable_options}
                    selectedValues={cartItem.options}
                />
            </section>
        </Suspense>
    ) : null;

    return (
        <Form className={classes.root}>
            <div className={classes.focusItem}>
                <span className={classes.name}>{itemName}</span>
                <span className={classes.price}>
                    <Price currencyCode={currencyCode} value={itemPrice} />
                </span>
            </div>
            <div className={classes.form}>
                {options}
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>
                        <span>Quantity</span>
                    </h2>
                    <Quantity
                        initialValue={initialQuantity}
                        onValueChange={handleValueChange}
                    />
                </section>
            </div>
            <div className={classes.save}>
                <Button onClick={handleCancel}>
                    <span>Cancel</span>
                </Button>
                <Button
                    priority="high"
                    onClick={handleUpdate}
                    disabled={isUpdateDisabled}
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
    isUpdatingItem: bool
};

export default CartOptions;
