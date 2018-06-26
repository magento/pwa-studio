import { Component, createElement } from 'react';
import { bool, shape, number, arrayOf, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import getUrlKey from 'src/util/getUrlKey';
import Page from 'src/components/Page';
import Carousel from 'src/components/ProductImageCarousel';
import Quantity from 'src/components/ProductQuantity';
import RichText from 'src/components/RichText';
import defaultClasses from './product.css';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

/**
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */
const productDetailQuery = gql`
    query productDetail($urlKey: String) {
        productDetail: products(filter: { url_key: { eq: $urlKey } }) {
            items {
                sku
                name
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                description
                media_gallery_entries {
                    label
                    position
                    disabled
                    file
                }
            }
        }
    }
`;

class Product extends Component {
    static propTypes = {
        classes: shape({
            action: string,
            actions: string,
            addToCart: string,
            cartActions: string,
            description: string,
            descriptionTitle: string,
            details: string,
            detailsTitle: string,
            imageCarousel: string,
            productName: string,
            productPrice: string,
            quantity: string,
            quantityTitle: string,
            root: string,
            title: string
        }),
        data: shape({
            productDetail: shape({
                total_count: number,
                items: arrayOf(
                    shape({
                        id: number,
                        sku: string.isRequired,
                        price: shape({
                            regularPrice: shape({
                                amount: shape({
                                    currency: string.isRequired,
                                    value: number.isRequired
                                })
                            }).isRequired
                        }).isRequired,
                        image: string,
                        image_label: string,
                        media_gallery_entries: arrayOf(
                            shape({
                                label: string,
                                position: number.isRequired,
                                disabled: bool,
                                file: string.isRequired
                            })
                        ),
                        description: string,
                        short_description: string,
                        canonical_url: string
                    })
                ).isRequired
            }).isRequired
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <Page>
                <Query
                    query={productDetailQuery}
                    variables={{ urlKey: getUrlKey() }}
                >
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;

                        const product = data.productDetail.items[0];
                        const { regularPrice } = product.price;

                        return (
                            <article className={classes.root}>
                                <section className={classes.title}>
                                    <h1 className={classes.productName}>
                                        <span>{product.name}</span>
                                    </h1>
                                    <p className={classes.productPrice}>
                                        <Price
                                            currencyCode={
                                                regularPrice.amount.currency
                                            }
                                            value={regularPrice.amount.value}
                                        />
                                    </p>
                                </section>
                                <section className={classes.imageCarousel}>
                                    <Carousel
                                        images={product.media_gallery_entries}
                                    />
                                </section>
                                <section className={classes.actions}>
                                    <button className={classes.action}>
                                        <span>Add to Wishlist</span>
                                    </button>
                                </section>
                                <section className={classes.quantity}>
                                    <h2 className={classes.quantityTitle}>
                                        <span>Quantity</span>
                                    </h2>
                                    <Quantity />
                                </section>
                                <section className={classes.cartActions}>
                                    <button className={classes.addToCart}>
                                        <span>Add to Cart</span>
                                    </button>
                                </section>
                                <section className={classes.description}>
                                    <h2 className={classes.descriptionTitle}>
                                        <span>Product Description</span>
                                    </h2>
                                    <RichText content={product.description} />
                                </section>
                                <section className={classes.details}>
                                    <h2 className={classes.detailsTitle}>
                                        <span>SKU</span>
                                    </h2>
                                    <strong>{product.sku}</strong>
                                </section>
                            </article>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

export default classify(defaultClasses)(Product);
