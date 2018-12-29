import React, { Component, Suspense } from 'react';
import { Query, Fragment } from 'react-apollo';
import { Form } from 'informed';
import gql from 'graphql-tag';
import classify from 'src/classify';
import defaultClasses from './miniCart.css';
import Button from 'src/components/Button';
import Quantity from 'src/components/ProductQuantity';

const Options = React.lazy(() => import('../ProductOptions'));

const query = gql`
    query productDetail($name: String, $onServer: Boolean!) {
        productDetail: products(filter: { name: { eq: $name } }) {
            items {
                id
                sku
                name
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        id
                        label
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                        }
                    }
                    variants {
                        product {
                            fashion_color
                            fashion_size
                            id
                            media_gallery_entries {
                                disabled
                                file
                                label
                                position
                            }
                            sku
                            stock_status
                        }
                    }
                }
                meta_title @include(if: $onServer)
                meta_keyword @include(if: $onServer)
                meta_description @include(if: $onServer)
            }
        }
    }
`;

class EditMenu extends Component {

    state = {
        optionSelections: new Map(),
        quantity: this.props.item.qty,
        isLoading: false
    }

    get fallback() {
        return <div>Loading...</div>;
    }

    handleClick = async (targetItem) => {
        const { updateCart, hideEditPanel } = this.props;
        const { optionSelections, quantity } = this.state;
        const { configurable_options, variants } = targetItem;
        const isConfigurable = Array.isArray(configurable_options);
        const productType = isConfigurable
        ? 'ConfigurableProduct'
        : 'SimpleProduct';

        const product = targetItem;

        const optionCodes = new Map();

        const payload = {
            item: product,
            productType,
            quantity: quantity
        }

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
        await updateCart(payload, this.props.item.item_id);
        this.setState({
            isLoading: false
        });
        hideEditPanel();
    };

    setQuantity = quantity => this.setState({ quantity });

    handleSelectionChange = (optionId, selection) => {
        this.setState(({ optionSelections }) => ({
            optionSelections: new Map(optionSelections).set(
                optionId,
                Array.from(selection).pop()
            )
        }));
    }

    render() {
        const { fallback, handleSelectionChange, props } = this;
        const { classes, item } = props;
        const { name, price } = item;
        const modalClass = this.state.isLoading ? classes.modal_active : classes.modal;

        return(
            <Query
                query={query}
                variables={{ name: name, onServer: false }}
            >
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return <div>Fetching Data</div>;

                    const item = data.productDetail.items[0];
                    const configurable_options = item.configurable_options;

                    let options = null;

                    if (Array.isArray(configurable_options)) {
                        options =
                            <Suspense fallback={fallback}>
                                <section className={classes.focusItem}>
                                    {name}
                                    <div className={classes.price}>${price}</div>
                                </section>
                                <section className={classes.options}>
                                    <Options
                                        options={configurable_options}
                                        onSelectionChange={handleSelectionChange}
                                    />
                                </section>
                            </Suspense>
                    }

                    return (
                        <Form className={classes.content}>
                            {options}
                            <section className={classes.quantity}>
                                <h2 className={classes.quantityTitle}>
                                    <span>Quantity</span>
                                </h2>
                                <Quantity
                                    initialValue={props.item.qty}
                                    onValueChange={this.setQuantity}
                                />
                            </section>
                            <div className={classes.save}>
                                <Button onClick={this.props.hideEditPanel}>Cancel</Button>
                                <Button onClick={() => this.handleClick(item)}>Update Cart</Button>
                            </div>
                            <div className={modalClass}>
                                <span className={classes.modalText}>Processing...</span>
                            </div>
                        </Form>
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(EditMenu);
