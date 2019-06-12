import React, { Component, Suspense } from 'react';
import { array, bool, func, number, shape, string } from 'prop-types';
import { Form, Text } from 'informed';
import { Price } from '@magento/peregrine';

import LoadingIndicator from 'src/components/LoadingIndicator';
import classify from 'src/classify';
import defaultClasses from './cartOptions.css';
import Button from 'src/components/Button';
import appendOptionsToPayload from 'src/util/appendOptionsToPayload';
import isProductConfigurable from 'src/util/isProductConfigurable';
import { Plus, Minus } from 'react-feather';

// TODO: get real currencyCode for cartItem
const currencyCode = 'USD';

const Options = React.lazy(() => import('../ProductOptions'));

class CartOptions extends Component {
    static propTypes = {
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
        }),
        isUpdatingItem: bool,
        updateCart: func.isRequired,
        closeOptionsDrawer: func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            optionSelections: new Map(),
            quantity: props.cartItem.qty
        };
    }

    get fallback() {
        return <LoadingIndicator>Fetching Data</LoadingIndicator>;
    }

    setQuantity = quantity => this.setState({ quantity });

    handleSelectionChange = (optionId, selection) => {
        this.setState(({ optionSelections }) => ({
            optionSelections: new Map(optionSelections).set(
                optionId,
                Array.from(selection).pop()
            )
        }));
    };

    handleClick = async () => {
        const { updateCart, cartItem, configItem } = this.props;
        const { optionSelections, quantity } = this.state;

        const payload = {
            item: configItem,
            productType: configItem.__typename,
            quantity: quantity
        };

        if (isProductConfigurable(configItem)) {
            appendOptionsToPayload(payload, optionSelections);
        }

        updateCart(payload, cartItem.item_id);
    };

    get isMissingOptions() {
        const { configItem, cartItem } = this.props;

        // Non-configurable products can't be missing options
        if (cartItem.product_type !== 'configurable') {
            return false;
        }

        // Configurable products are missing options if we have fewer
        // option selections than the product has options.
        const { configurable_options } = configItem;
        const numProductOptions = configurable_options.length;
        const numProductSelections = this.state.optionSelections.size;

        return numProductSelections < numProductOptions;
    }

    incrementQty = formApi => {
        var currentQuantity = parseInt(this.state.quantity) || 0;
        const incrementedQty = currentQuantity + 1;
        this.setQuantity(incrementedQty);
        formApi.setValue('quantity_update', incrementedQty);
    };

    decrementQty = formApi => {
        var currentQuantity = parseInt(this.state.quantity) || 0;
        const decrementedQty = currentQuantity - 1;
        this.setQuantity(decrementedQty);
        formApi.setValue('quantity_update', decrementedQty);
    };

    render() {
        const {
            fallback,
            handleSelectionChange,
            isMissingOptions,
            props
        } = this;
        const { classes, cartItem, configItem, isUpdatingItem } = props;
        const { name, price } = cartItem;

        const modalClass = isUpdatingItem
            ? classes.modal_active
            : classes.modal;

        const IncrementButtonFormApi = ({ formApi }) => {
            return (
                <button
                    aria-label="Quantity Increment"
                    type="button"
                    onClick={() => {
                        this.incrementQty(formApi);
                    }}
                >
                    <Plus />
                </button>
            );
        };

        const DecrementButtonFormApi = ({ formApi }) => {
            return (
                <button
                    aria-label="Quantity Decrement"
                    type="button"
                    onClick={() => {
                        this.decrementQty(formApi);
                    }}
                >
                    <Minus />
                </button>
            );
        };

        const validateQuantity = value => {
            var validateRegex = /^[1-9]\d*(\.\d+)?$/;
            return value <= 0
                ? 'Please enter a quantity greater than 0.'
                : value == undefined || !validateRegex.test(value)
                ? 'Please enter a valid number in this field.'
                : undefined;
        };

        return (
            <Form className={classes.root}>
                {({ formState, formApi }) => (
                    <>
                        <div className={classes.focusItem}>
                            <span className={classes.name}>{name}</span>
                            <span className={classes.price}>
                                <Price
                                    currencyCode={currencyCode}
                                    value={price}
                                />
                            </span>
                        </div>
                        <div className={classes.form}>
                            <section className={classes.options}>
                                <Suspense fallback={fallback}>
                                    <Options
                                        onSelectionChange={
                                            handleSelectionChange
                                        }
                                        product={configItem}
                                    />
                                </Suspense>
                            </section>
                            <section className={classes.quantity}>
                                <h2 className={classes.quantityTitle}>
                                    <span>Quantity</span>
                                </h2>
                                <DecrementButtonFormApi formApi={formApi} />
                                <label htmlFor="quantity_update" />
                                <Text
                                    id="quantity_update"
                                    type="text"
                                    field="quantity_update"
                                    initialValue={props.cartItem.qty}
                                    onValueChange={this.setQuantity}
                                    validateOnChange
                                    validate={validateQuantity}
                                    className={classes.quantityInput}
                                />
                                <IncrementButtonFormApi formApi={formApi} />
                                <p className={classes.errors}>
                                    {formState.errors.quantity_update}
                                </p>
                            </section>
                        </div>
                        <div className={classes.save}>
                            <Button onClick={this.props.closeOptionsDrawer}>
                                <span>Cancel</span>
                            </Button>
                            <Button
                                priority="high"
                                onClick={this.handleClick}
                                disabled={
                                    isMissingOptions ||
                                    formState.errors.quantity_update
                                }
                            >
                                <span>Update Cart</span>
                            </Button>
                        </div>
                        <div className={modalClass}>
                            <LoadingIndicator>Updating Cart</LoadingIndicator>
                        </div>
                    </>
                )}
            </Form>
        );
    }
}

export default classify(defaultClasses)(CartOptions);
