import React, { Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Info } from 'react-feather';

import { ProductOptionsShimmer } from '../ProductOptions';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { useStyle } from '../../classify';

import Breadcrumbs from '../Breadcrumbs';
import Button from '../Button';
import Price from '@magento/venia-ui/lib/components/Price';
import ProductFullDetailB2B from './ProductFullDetailB2B/ProductFullDetailB2B';
import ProductFullDetailB2C from './ProductFullDetailB2C/ProductFullDetailB2C';
import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.module.css';

const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'));

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product } = props;
    const [quantity, setQuantity] = useState(1);

    const talonProps = useProductFullDetail({ product });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isEverythingOutOfStock,
        outOfStockVariants,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        wishlistButtonProps,
        hasOptionsOfTheSelection,
        addConfigurableProductToCart,
        isAddConfigurableLoading,
        cartId,
        customAttributes,
        setOptionSelections,
        isSimpleProductSelected,
        isB2B,
        selectedVarient,
        isOutOfStockProduct
    } = talonProps;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const {
        price: {
            regularPrice: {
                amount: { value: regularPriceValue }
            },
            minimalPrice: {
                amount: { value: minimalPriceValue }
            }
        }
    } = productDetails;

    const priceRender =
        regularPriceValue == minimalPriceValue ? (
            <div>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={productDetails.price.regularPrice.amount.currency}
                        value={productDetails.price.regularPrice.amount.value}
                    />
                </p>
            </div>
        ) : (
            <div>
                <p className={classes.productOldPrice}>
                    <Price
                        currencyCode={productDetails.price.regularPrice.amount.currency}
                        value={productDetails.price.regularPrice.amount.value}
                    />
                </p>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={productDetails.price.minimalPrice.amount.currency}
                        value={productDetails.price.minimalPrice.amount.value}
                    />
                </p>
            </div>
        );

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
                sku={product.sku}
                isEverythingOutOfStock={isEverythingOutOfStock}
                outOfStockVariants={outOfStockVariants}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
            productSku={productDetails.sku}
            setOptionSelections={setOptionSelections}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
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

        // Handle cases where a cart wasn't created properly.
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

        // An unknown error should still present a readable message.
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
        regularPriceValue == minimalPriceValue ? (
            <div>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={productDetails.price.regularPrice.amount.currency}
                        value={productDetails.price.regularPrice.amount.value * quantity}
                    />
                </p>
            </div>
        ) : (
            <div>
                <p className={classes.productOldPrice}>
                    <Price
                        currencyCode={productDetails.price.regularPrice.amount.currency}
                        value={productDetails.price.regularPrice.amount.value * quantity}
                    />
                </p>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={productDetails.price.minimalPrice.amount.currency}
                        value={productDetails.price.minimalPrice.amount.value * quantity}
                    />
                </p>
            </div>
        );

    const tempTotalPrice =
        productDetails.price?.minimalPrice?.amount?.value !== -1 &&
        productDetails.price?.regularPrice?.amount?.value !== -1
            ? calculateTotalPrice
            : null;

    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
    };

    const cartCallToActionText = !isOutOfStock ? (
        <FormattedMessage id="productFullDetail.addItemToCart" defaultMessage="Add to Cart" />
    ) : (
        <FormattedMessage id="productFullDetail.itemOutOfStock" defaultMessage="Out of Stock" />
    );

    const cartActionContent = isSupportedProductType ? (
        <div className={isAddToCartDisabled ? classes.disabledButton : null}>
            <Button
                data-cy="ProductFullDetail-addToCartButton"
                disabled={
                    isAddToCartDisabled ||
                    productDetails.price?.minimalPrice?.amount?.value === -1 ||
                    productDetails.price?.regularPrice?.amount?.value === -1
                }
                aria-disabled={isAddToCartDisabled}
                aria-label={
                    isEverythingOutOfStock
                        ? formatMessage({
                              id: 'productFullDetail.outOfStockProduct',
                              defaultMessage: 'This item is currently out of stock'
                          })
                        : ''
                }
                priority="high"
                type="submit"
            >
                {cartCallToActionText}
            </Button>
        </div>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={'This product is currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    return isB2B ? (
        <ProductFullDetailB2B
            addConfigurableProductToCart={addConfigurableProductToCart}
            availableOptions={options}
            breadcrumbs={breadcrumbs}
            cartId={cartId}
            errors={errors}
            isAddConfigurableLoading={isAddConfigurableLoading}
            mediaGalleryEntries={mediaGalleryEntries}
            priceRender={priceRender}
            product={product}
            productDetails={productDetails}
            wishlistButtonProps={wishlistButtonProps}
        />
    ) : (
        <ProductFullDetailB2C
            availableOptions={options}
            breadcrumbs={breadcrumbs}
            cartActionContent={cartActionContent}
            errors={errors}
            handleAddToCart={handleAddToCart}
            handleQuantityChange={handleQuantityChange}
            hasOptionsOfTheSelection={hasOptionsOfTheSelection}
            mediaGalleryEntries={mediaGalleryEntries}
            priceRender={priceRender}
            productDetails={productDetails}
            tempTotalPrice={tempTotalPrice}
            wishlistButtonProps={wishlistButtonProps}
            customAttributes={customAttributes}
            product={product}
            isOutOfStock={isOutOfStock}
            isSimpleProductSelected={isSimpleProductSelected}
            selectedVarient={selectedVarient}
            isOutOfStockProduct={isOutOfStockProduct}
            isEverythingOutOfStock={isEverythingOutOfStock}
            outOfStockVariants={outOfStockVariants}
        />
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsPageBuilder: string,
        detailsPageBuilderList: string,
        detailsTitle: string,
        imageCarousel: string,
        availableOptions: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        quantityRoot: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
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
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string,
        short_description: shape({
            html: string,
            __typename: string
        })
    }).isRequired
};

export default ProductFullDetail;
