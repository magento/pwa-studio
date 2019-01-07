import React, { Component, Suspense } from 'react';
import { Form } from 'informed';
import classify from 'src/classify';
import defaultClasses from './cartOptions.css';
import Button from 'src/components/Button';
import Quantity from 'src/components/ProductQuantity';

const Options = React.lazy(() => import('../ProductOptions'));

class CartOptions extends Component {
    state = {
        optionSelections: new Map(),
        quantity: this.props.cartItem.qty,
        isLoading: false
    };

    get fallback() {
        return <div>Loading...</div>;
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
        const { updateCart, hideEditPanel, cartItem, configItem } = this.props;
        const { optionSelections, quantity } = this.state;
        const { configurable_options, variants } = configItem;
        const isConfigurable = Array.isArray(configurable_options);
        const productType = isConfigurable
            ? 'ConfigurableProduct'
            : 'SimpleProduct';

        const product = configItem;

        const optionCodes = new Map();

        const payload = {
            item: product,
            productType,
            quantity: quantity
        };

        if (productType === 'ConfigurableProduct') {
            for (const option of configurable_options) {
                optionCodes.set(option.attribute_id, option.attribute_code);
            }
            const options = Array.from(optionSelections, ([id, value]) => ({
                option_id: id,
                option_value: value
            }));

            const item = variants.find(({ product: variant }) => {
                for (const [id, value] of optionSelections) {
                    const code = optionCodes.get(id);

                    if (variant[code] !== value) {
                        return false;
                    }
                }

                return true;
            });

            Object.assign(payload, {
                options,
                parentSku: product.sku,
                item: Object.assign({}, item.product)
            });
        }
        this.setState({
            isLoading: true
        });
        await updateCart(payload, cartItem.item_id);
        this.setState({
            isLoading: false
        });
        hideEditPanel();
    };

    render() {
        const { fallback, handleSelectionChange, props, state } = this;
        const { classes, cartItem, configItem } = props;
        const { name, price } = cartItem;
        const { configurable_options } = configItem;

        const modalClass = state.isLoading
            ? classes.modal_active
            : classes.modal;

        const options = Array.isArray(configurable_options) ? (
            <Suspense fallback={fallback}>
                <section className={classes.options}>
                    <Options
                        options={configurable_options}
                        onSelectionChange={handleSelectionChange}
                    />
                </section>
            </Suspense>
        ) : null;

        return (
            <Form className={classes.root}>
                <div className={classes.focusItem}>
                    {name}
                    <div className={classes.price}>${price}</div>
                </div>
                <div className={classes.form}>
                    {options}
                    <section className={classes.quantity}>
                        <h2 className={classes.quantityTitle}>
                            <span>Quantity</span>
                        </h2>
                        <Quantity
                            initialValue={props.cartItem.qty}
                            onValueChange={this.setQuantity}
                        />
                    </section>
                </div>
                <div className={classes.save}>
                    <Button onClick={this.props.hideEditPanel}>Cancel</Button>
                    <Button onClick={this.handleClick}>Update Cart</Button>
                </div>
                <div className={modalClass}>
                    <span className={classes.modalText}>Processing...</span>
                </div>
            </Form>
        );
    }
}

export default classify(defaultClasses)(CartOptions);
