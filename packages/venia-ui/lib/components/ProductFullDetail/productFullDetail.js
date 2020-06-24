import React, { Fragment, Suspense, useEffect, useRef } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';

import { Price } from '@magento/peregrine';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { mergeClasses } from '../../classify';
import Breadcrumbs from '../Breadcrumbs';
import Button from '../Button';
import Carousel from '../ProductImageCarousel';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import Quantity from '../ProductQuantity';
import RichText from '../RichText';

import defaultClasses from './productFullDetail.css';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from './productFullDetail.gql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
const Options = React.lazy(() => import('../ProductOptions'));

// Correlate a GQL error message to a field.
const ERROR_MESSAGE_TO_FIELD_MAP = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages.
const ERROR_FIELD_TO_MESSAGE_MAP = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product } = props;

    const talonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        createCartMutation: CREATE_CART_MUTATION,
        product
    });

    const {
        breadcrumbCategoryId,
        derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        handleSetQuantity,
        isAddToCartDisabled,
        mediaGalleryEntries,
        productDetails,
        quantity
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with section -> error.
    const errors = new Map();
    if (derivedErrorMessage) {
        let handled = false;
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAP).forEach(key => {
            if (derivedErrorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAP[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAP[target];
                errors.set(target, message);
                handled = true;
            }
        });
        if (!handled) {
            errors.set(
                'form',
                'Something unexpected occurred. Please try again!'
            );
        }
    }

    // If there are form errors, display and scroll to them.
    const errorsRef = useRef(null);
    const formErrors = errors.get('form');
    let formErrorSection;
    if (formErrors) {
        formErrorSection = (
            <section ref={errorsRef} className={classes.formErrors}>
                {errors.get('form')}
            </section>
        );
    }

    useEffect(() => {
        if (formErrors) {
            errorsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [formErrors]);

    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        {productDetails.name}
                    </h1>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={productDetails.price.currency}
                            value={productDetails.price.value}
                        />
                    </p>
                </section>
                <section className={classes.imageCarousel}>
                    <Carousel images={mediaGalleryEntries} />
                </section>
                {formErrorSection}
                <section className={classes.options}>{options}</section>
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>Quantity</h2>
                    <Quantity
                        initialValue={quantity}
                        onValueChange={handleSetQuantity}
                        message={errors.get('quantity') || null}
                    />
                </section>
                <section className={classes.cartActions}>
                    <Button
                        priority="high"
                        onClick={handleAddToCart}
                        disabled={isAddToCartDisabled}
                    >
                        Add to Cart
                    </Button>
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        Product Description
                    </h2>
                    <RichText content={productDetails.description} />
                </section>
                <section className={classes.details}>
                    <h2 className={classes.detailsTitle}>SKU</h2>
                    <strong>{productDetails.sku}</strong>
                </section>
            </Form>
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string
    }),
    product: shape({
        __typename: string,
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
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
