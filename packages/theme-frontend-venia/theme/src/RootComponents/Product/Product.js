import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Carousel from 'src/components/ProductImageCarousel';
import Options from 'src/components/ProductOptions';
import Quantity from 'src/components/ProductQuantity';
import RichText from 'src/components/RichText';
import mockData from './mockData';
import defaultClasses from './product.css';

class Product extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        data: PropTypes.shape({
            additionalInfo: PropTypes.string,
            description: PropTypes.string,
            images: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string
                })
            ),
            name: PropTypes.string,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string
                })
            ),
            price: PropTypes.string
        })
    };

    static defaultProps = {
        data: mockData
    };

    render() {
        const { classes, data } = this.props;

        return (
            <article className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        <span>{data.name}</span>
                    </h1>
                    <p className={classes.productPrice}>
                        <span>{data.price}</span>
                    </p>
                </section>
                <section className={classes.imageCarousel}>
                    <Carousel images={data.images} />
                </section>
                <section className={classes.actions}>
                    <button className={classes.action}>
                        <span>Add to Wishlist</span>
                    </button>
                </section>
                <section className={classes.options}>
                    <Options options={data.options} />
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
                    <RichText content={data.description} />
                </section>
                <section className={classes.details}>
                    <h2 className={classes.detailsTitle}>
                        <span>Details</span>
                    </h2>
                    <RichText content={data.additionalInfo} />
                </section>
                <section className={classes.related}>
                    <h2 className={classes.relatedTitle}>
                        <span>Similar Products</span>
                    </h2>
                </section>
            </article>
        );
    }
}

export default classify(defaultClasses)(Product);
