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
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from '../ProductFullDetail/productFullDetail.gql';
import defaultClasses from './cartOptions.css';
import { REMOVE_ITEM_MUTATION, UPDATE_ITEM_MUTATION } from './cartOptions.gql';

const Options = React.lazy(() => import('../ProductOptions'));

const loadingIndicator = (
    <LoadingIndicator>
        <span>{'Fetching Options...'}</span>
    </LoadingIndicator>
);

const CartOptions = props => {
    const { cartItem, configItem, currencyCode, endEditItem } = props;

    const talonProps = useCartOptions({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        cartItem,
        configItem,
        createCartMutation: CREATE_CART_MUTATION,
        endEditItem,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        removeItemMutation: REMOVE_ITEM_MUTATION,
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

    const options = isProductConfigurable(configItem) ? (
        <Suspense fallback={loadingIndicator}>
            <section className={classes.options}>
                <Options
                    onSelectionChange={handleSelectionChange}
                    options={configItem.configurable_options}
                    selectedValues={cartItem.configurable_options}
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
        </Form>
    );
};

CartOptions.propTypes = {
    cartItem: shape({
        id: string.isRequired,
        product: shape({
            name: string.isRequired,
            price: shape({
                regularPrice: shape({
                    amount: shape({
                        value: number.isRequired
                    })
                })
            })
        })
    }),
    classes: shape({
        root: string,
        focusItem: string,
        price: string,
        form: string,
        quantity: string,
        quantityTitle: string,
        save: string,
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
