import React, { Suspense, useCallback, useState } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Price } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import defaultClasses from './productFullDetail.css';
import { mergeClasses } from '../../classify';

import Button from '../Button';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import Carousel from '../ProductImageCarousel';
import Quantity from '../ProductQuantity';
import RichText from '../RichText';

import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

const Options = React.lazy(() => import('../ProductOptions'));

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const INITIAL_QUANTITY = 1;

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = optionSelections.size;

    return numProductSelections < numProductOptions;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = optionSelections.size > 0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? [...item.product.media_gallery_entries, ...media_gallery_entries]
            : media_gallery_entries;
    }

    const key = value.reduce((fullKey, entry) => {
        return `${fullKey},${entry.file}`;
    }, '');

    return { key, value };
};

const ProductFullDetail = props => {
    const [{ isAddingItem }, { addItemToCart }] = useCartContext();

    // Props.
    const { product } = props;

    // State.
    const [quantity, setQuantity] = useState(INITIAL_QUANTITY);
    const [optionSelections, setOptionSelections] = useState(
        INITIAL_OPTION_SELECTIONS
    );
    const derivedOptionCodes = deriveOptionCodesFromProduct(product);
    const [optionCodes] = useState(derivedOptionCodes);

    // Members.
    const { amount: productPrice } = product.price.regularPrice;
    const classes = mergeClasses(defaultClasses, props.classes);
    const isMissingOptions = getIsMissingOptions(product, optionSelections);
    const mediaGalleryEntries = getMediaGalleryEntries(
        product,
        optionCodes,
        optionSelections
    );

    // Event handlers.
    const handleAddToCart = useCallback(() => {
        const payload = {
            item: product,
            productType: product.__typename,
            quantity
        };

        if (isProductConfigurable(product)) {
            appendOptionsToPayload(payload, optionSelections, optionCodes);
        }

        addItemToCart(payload);
    }, [addItemToCart, optionCodes, optionSelections, product, quantity]);

    const handleSelectionClick = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const newOptionSelections = new Map([...optionSelections]);
            newOptionSelections.set(optionId, selection);
            setOptionSelections(newOptionSelections);
        },
        [optionSelections]
    );

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionClick={handleSelectionClick}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    return (
        <Form className={classes.root}>
            <section className={classes.title}>
                <h1 className={classes.productName}>{product.name}</h1>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={productPrice.currency}
                        value={productPrice.value}
                    />
                </p>
            </section>
            <section className={classes.imageCarousel}>
                <Carousel
                    images={mediaGalleryEntries.value}
                    key={mediaGalleryEntries.key}
                />
            </section>
            <section className={classes.options}>{options}</section>
            <section className={classes.quantity}>
                <h2 className={classes.quantityTitle}>Quantity</h2>
                <Quantity initialValue={quantity} onValueChange={setQuantity} />
            </section>
            <section className={classes.cartActions}>
                <Button
                    priority="high"
                    onClick={handleAddToCart}
                    disabled={isAddingItem || isMissingOptions}
                >
                    Add to Cart
                </Button>
            </section>
            <section className={classes.description}>
                <h2 className={classes.descriptionTitle}>
                    Product Description
                </h2>
                <RichText content={product.description} />
            </section>
            <section className={classes.details}>
                <h2 className={classes.detailsTitle}>SKU</h2>
                <strong>{product.sku}</strong>
            </section>
        </Form>
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
