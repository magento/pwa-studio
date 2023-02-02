/* eslint-disable react/jsx-no-literals */
import React, { useState } from 'react';
import defaultClasses from './simpleProduct.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FullPageLoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Price from '@magento/venia-ui/lib/components/Price';
import { FormattedMessage } from 'react-intl';
import { useSimpleProduct } from '@magento/peregrine/lib/talons/ProductFullDetail/SimpleProduct/useSimpleProduct';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import { ADD_CONFIGURABLE_MUTATION } from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql.ce';
import ErrorView from '../../ErrorView/errorView';
import SimpleProductB2B from './simpleProductB2B';
import SimpleProductB2C from './simpleProductB2C';

const SimpleProduct = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [quantity, setQuantity] = useState(1);

    const talonProps = useSimpleProduct({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        productQuantity: quantity
    });
    const { wishlistButtonProps, errorMessage, cartId, handleAddToCart, fetchedData, loading, error } = talonProps;

    if (loading) {
        return <FullPageLoadingIndicator />;
    }
    if (error || !fetchedData) {
        return <ErrorView />;
    }

    const simpleProductData = fetchedData.products.items[0];
    const simpleProductAggregation = fetchedData.products.aggregations;
    const simpleProductAggregationFiltered = simpleProductAggregation.filter(
        product => product.label !== 'Category' && product.label !== 'Price' && product.label !== 'Material estructura'
    );

    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
    };

    const wishlistButton = wishlistButtonProps ? <WishlistGalleryButton {...wishlistButtonProps} /> : null;

    const priceRender =
        simpleProductData.price.regularPrice.amount.value === simpleProductData.price.minimalPrice.amount.value ? (
            <section>
                <article className={classes.productPrice}>
                    <Price
                        currencyCode={simpleProductData.price.regularPrice.amount.currency}
                        value={simpleProductData.price.regularPrice.amount.value}
                    />
                </article>
            </section>
        ) : (
            <section>
                <article className={classes.productOldPrice}>
                    <Price
                        currencyCode={simpleProductData.price.regularPrice.amount.currency}
                        value={simpleProductData.price.regularPrice.amount.value}
                    />
                </article>
                <article className={classes.productPrice}>
                    <Price
                        currencyCode={simpleProductData.price.minimalPrice.amount.currency}
                        value={simpleProductData.price.minimalPrice.amount.value}
                    />
                </article>
            </section>
        );

    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        if (errorMessage.includes('Variable "$cartId" got invalid value null')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage: 'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const calculateTotalPrice =
        simpleProductData.price.regularPrice.amount.value === simpleProductData.price.minimalPrice.amount.value ? (
            <section>
                <article className={classes.productPrice}>
                    <Price
                        currencyCode={simpleProductData.price.regularPrice.amount.currency}
                        value={simpleProductData.price.regularPrice.amount.value * quantity}
                    />
                </article>
            </section>
        ) : (
            <section>
                <article className={classes.productOldPrice}>
                    <Price
                        currencyCode={simpleProductData.price.regularPrice.amount.currency}
                        value={simpleProductData.price.regularPrice.amount.value * quantity}
                    />
                </article>
                <article className={classes.productPrice}>
                    <Price
                        currencyCode={simpleProductData.price.minimalPrice.amount.currency}
                        value={simpleProductData.price.minimalPrice.amount.value * quantity}
                    />
                </article>
            </section>
        );

    const tempTotalPrice =
        simpleProductData.price?.minimalPrice?.amount?.value !== -1 &&
        simpleProductData.price?.regularPrice?.amount?.value !== -1
            ? calculateTotalPrice
            : null;

    const indexTable = (
        <ul className={classes.productItemContainer}>
            <li key="imageIndex" className={classes.indexFixed} />
            <li key="skuIndex" className={classes.indexMobileSku}>
                SKU
            </li>
            <li className={classes.categoriesItemList}>
                {simpleProductAggregationFiltered.map(category => (
                    <p key={category.label} className={classes.indexFixedCategory}>
                        {category.label}
                    </p>
                ))}
            </li>
            <li key="quantityIndex" className={classes.indexFixed}>
                <FormattedMessage id={'productFullDetailB2B.indexQuantity'} defaultMessage={'Quantity'} />
            </li>
            <li className={classes.titles} key="priceIndex">
                <FormattedMessage id={'productFullDetailB2B.indexUnitPrice'} defaultMessage={'Price / Unit'} />
            </li>
            <li className={classes.titles} key="totalPriceIndex">
                <FormattedMessage id={'productFullDetailB2B.totalPrice'} defaultMessage={'Total Price'} />
            </li>
        </ul>
    );

    return process.env.IS_B2B === 'true' ? (
        <SimpleProductB2B
            handleQuantityChange={handleQuantityChange}
            indexTable={indexTable}
            errors={errors}
            priceRender={priceRender}
            wishlistButton={wishlistButton}
            cartId={cartId}
            handleAddToCart={handleAddToCart}
            simpleProductData={simpleProductData}
            simpleProductAggregation={simpleProductAggregationFiltered}
            tempTotalPrice={tempTotalPrice}
        />
    ) : (
        <SimpleProductB2C
            handleQuantityChange={handleQuantityChange}
            simpleProductData={simpleProductData}
            handleAddToCart={handleAddToCart}
            priceRender={priceRender}
            errors={errors}
            tempTotalPrice={tempTotalPrice}
            wishlistButton={wishlistButton}
            simpleProductAggregationFiltered={simpleProductAggregationFiltered}
        />
    );
};

export default SimpleProduct;
