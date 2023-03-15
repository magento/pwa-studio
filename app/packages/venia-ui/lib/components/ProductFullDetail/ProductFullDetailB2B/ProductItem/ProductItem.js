/* eslint-disable react/jsx-no-literals */
import React, { useCallback, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';
import QuantityStepper from '../../../QuantityStepper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '../../../Price';
import Image from '../../../Image';
import Icon from '../../../Icon';
import Button from '../../../Button';
import defaultClasses from './ProductItem.module.css';
import inStock from '../icons/inStock.svg';
import outOfStock from '../icons/outOfStock.svg';
import copyToClipboard from '../icons/copyToClipboard.png';

import { useAddToQuote } from '@magento/peregrine/lib/talons/QuickOrderForm/useAddToQuote';
import ConfirmationModal from '../../../RequestQuote/ConfirmationModal';
import PlaceholderImage from '../../../Image/placeholderImage';
import NotifyPrice from '../../../ProductsAlert/NotifyPrice';
import PriceAlert from '../../../ProductsAlert/PriceAlertModal/priceAlert';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';
import NotifyButton from '../../../ProductsAlert/NotifyButton/NotifyButton';
import StockAlert from '../../../ProductsAlert/StockAlertModal/stockAlert';

const ProductItem = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        product,
        variant,
        categoriesValuesName,
        categoriesName,
        addConfigurableProductToCart,
        cartId,
        errors
    } = props;
    const [copied, setCopied] = useState(false);
    const productAlertStatus = variant?.product?.mp_product_alert;
    const productsAlert = useProductsAlert({ ItemSku: variant?.product?.sku });
    const {
        isStockModalOpened,
        handleOpendStockModal,
        handleCloseModal,
        handleOpenPriceModal,
        openPriceModal,
        formProps,
        submitStockAlert,
        handleSubmitPriceAlert,
        alertConfig
    } = productsAlert;

    const { handleAddCofigItemBySku } = useAddToQuote();
    const copyText = () => {
        navigator.clipboard.writeText(variant.product.sku);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const [quantity, setQuantity] = useState(1);

    const [error, setError] = useState('');

    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        setTimeout(() => setError(''), 10000);
    }, [error]);

    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
    };

    const handleAddProductToCart = useCallback(async () => {
        const variables = {
            cartId,
            quantity: quantity,
            sku: variant.product.sku,
            parentSku: product.sku
        };
        try {
            await addConfigurableProductToCart({
                variables
            });
        } catch {
            setError('Error');
        }
    }, [cartId, quantity, variant, addConfigurableProductToCart, setError, product]);

    const confirmRequestQuote = () => {
        const simpleProducts = [
            {
                sku: variant.product.sku,
                orParentSku: product.sku,
                quantity
            }
        ];
        handleAddCofigItemBySku(simpleProducts);
        setIsOpen(false);
    };

    const requestQuoteButton = (
        <Button
            className={classes.requestButton}
            disabled={variant.product.stock_status === 'OUT_OF_STOCK'}
            onClick={() => setIsOpen(true)}
            priority="high"
        >
            <FormattedMessage id={'productFullDetailB2B.quote'} defaultMessage={'Quote'} />
        </Button>
    );

    const stockStatusText = (
        <FormattedMessage id={'productFullDetailB2B.stockStatus'} defaultMessage={'Stock Status'} />
    );

    const totalPriceText = <FormattedMessage id={'productFullDetailB2B.totalPrice'} defaultMessage={'Total Price'} />;

    const imageIcon = widthSize => (
        <div className={classes.indexFixedImage}>
            {variant.product?.media_gallery_entries.length > 0 ? (
                <Image
                    resource={variant.product?.media_gallery_entries[0]?.file}
                    width={widthSize}
                    alt={variant.product.sku}
                />
            ) : (
                <div className={classes.placeholderContainer}>
                    <PlaceholderImage alt={variant.product.name} classes={classes} width={widthSize} height="120" />
                </div>
            )}
        </div>
    );

    const nameTag = <p>{product.name + ' ' + categoriesValuesName.join(' - ')}</p>;

    const quantitySelector = (id = 1) => (
        <div className={classes.quantity}>
            <QuantityStepper
                fieldName={`${variant.product.sku}-${id}`}
                classes={{ root: classes.quantityRoot }}
                min={1}
                onChange={handleQuantityChange}
            />
        </div>
    );

    const priceTag = (
        <div className={classes.priceContainer}>
            <span className={classes.indexFixed}>
                <Price
                    currencyCode={variant.product.price.regularPrice.amount.currency}
                    value={variant.product.price.minimalPrice.amount.value}
                />
            </span>
            {productAlertStatus?.mp_productalerts_price_alert && (
                <div className={classes.notifyPrice}>
                    <NotifyPrice handleOpenPriceModal={handleOpenPriceModal} />
                </div>
            )}
        </div>
    );

    const stockStatus =
        variant.product.stock_status === 'IN_STOCK' ? (
            <div className={classes.inStockContainer}>
                <img src={inStock} alt="inStock" />
            </div>
        ) : (
            <div className={classes.outStockContainer}>
                <img src={outOfStock} alt="outOfStock" />
            </div>
        );
    const addToCartButton = (
        <Button
            className={classes.buttonAddToCart}
            onClick={handleAddProductToCart}
            disabled={
                variant.product.stock_status === 'OUT_OF_STOCK' ||
                variant.product.price?.minimalPrice?.amount?.value === -1
            }
        >
            <Icon
                classes={{
                    icon: classes.buttonAddToCartIcon
                }}
                size={16}
                src={ShoppingCartIcon}
            />
        </Button>
    );

    const stockButton =
        variant?.product?.stock_status === 'OUT_OF_STOCK' && productAlertStatus?.mp_productalerts_stock_notify ? (
            <div className={classes.stockBtnWrapper}>
                <NotifyButton
                    handleOpendStockModal={handleOpendStockModal}
                    productStatus={variant?.product?.stock_status}
                />
            </div>
        ) : (
            addToCartButton
        );
    const categoriesKeyValue = () => {
        const tempCategoriesKeyValueList = [];
        categoriesName.map((categoryName, i) => {
            return tempCategoriesKeyValueList.push([categoryName, categoriesValuesName[i]]);
        });
        return tempCategoriesKeyValueList;
    };

    const lastDigitsOfSku = variant.product.sku.substring(variant.product.sku.length - 7);

    const productItemDesktop = (
        <div className={classes.productItemErrorContainerDesktop}>
            <div className={classes.errorMessage}>{error != '' && <p>{errors.get('quantity')}</p>}</div>

            <div className={classes.productItemContainerDesktop}>
                {imageIcon(120)}
                <div className={classes.indexMobileName}>{nameTag}</div>
                <p className={classes.indexMobileSku}>
                    {' '}
                    {copied ? (
                        <div className={classes.copiedText}>
                            <FormattedMessage id={'productFullDetailB2B.copiedText'} defaultMessage={'Copied'} />
                        </div>
                    ) : (
                        <div className={classes.productSkuContainer}>
                            <a onClick={copyText}>...{lastDigitsOfSku}</a>
                            <img src={copyToClipboard} alt="copyToClipboard" onClick={copyText} />
                        </div>
                    )}
                </p>
                <div className={classes.categoriesItemList}>
                    {categoriesValuesName.map((category, i) => {
                        return (
                            <p key={`${variant.product.sku}-${category}-${i}`} className={classes.indexFixedCategory}>
                                {category}
                            </p>
                        );
                    })}
                </div>
                {quantitySelector(1)}
                {priceTag}
                <span className={classes.indexFixed}>
                    <Price
                        currencyCode={variant.product.price.regularPrice.amount.currency}
                        value={variant.product.price.minimalPrice.amount.value * quantity || 0}
                    />
                </span>
                <div className={classes.stockAddContainer}>
                    {stockStatus}
                    {variant.product.price.minimalPrice.amount.value ? stockButton : requestQuoteButton}
                </div>
            </div>
            <ConfirmationModal
                isOpen={isOpen}
                onCancel={() => setIsOpen(false)}
                onConfirm={confirmRequestQuote}
                product={variant}
                quantity={quantity}
                setQuantity={val => setQuantity(val)}
            />
        </div>
    );

    const productItemMobile = (
        <div className={classes.productItemContainerMobile}>
            <div className={classes.productItemContainerMobileContent}>
                {/* Header Part */}
                <div className={classes.productItemHeaderMobile}>
                    <div className={classes.productItemHeaderImageMobile}>{imageIcon(150)}</div>
                    <div className={classes.productItemHeaderTextMobile}>
                        <h2>{nameTag}</h2>
                        <small className={classes.skuTextMobile}>{variant.product.sku}</small>
                        <div className={classes.stockStatusContainer}>
                            <div>{stockStatusText}:</div>
                            <div className={classes.stockStatusCircle}>{stockStatus}</div>
                        </div>
                        <h2>{priceTag}</h2>
                    </div>
                </div>

                {/* Body */}
                <div className={classes.productItemBodyInformation}>
                    {categoriesKeyValue().map(row => {
                        return (
                            <div className={classes.productItemBodyInformationRow}>
                                <p className={classes.mobileCategoryName}>{row[0]} </p>
                                <p className={classes.mobileCategoryValue}>{row[1]}</p>
                            </div>
                        );
                    })}
                </div>
                <div className={classes.actionsContainer}>
                    <div className={classes.totalPriceContainer}>
                        <div> {totalPriceText}:</div>
                        <div className={classes.totalWrapper}>
                            {' '}
                            <span className={classes.indexFixed}>
                                <Price
                                    currencyCode={variant.product.price.regularPrice.amount.currency}
                                    value={variant.product.price.minimalPrice.amount.value * quantity}
                                />
                            </span>
                        </div>
                    </div>
                    <div className={classes.productItemBodyOperations}>
                        {quantitySelector(2)}
                        {variant.product.price.minimalPrice.amount.value ? stockButton : requestQuoteButton}
                    </div>
                    {error != '' && <p style={{ color: '#f00' }}>{errors.get('quantity')}</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {productItemDesktop} {productItemMobile}
            <PriceAlert
                formProps={formProps}
                isOpen={openPriceModal}
                onConfirm={handleSubmitPriceAlert}
                onCancel={handleCloseModal}
                alertConfig={alertConfig?.price_alert}
            />
            <StockAlert
                isOpen={isStockModalOpened}
                onConfirm={submitStockAlert}
                formProps={formProps}
                onCancel={handleCloseModal}
                alertConfig={alertConfig?.stock_alert}
            />
        </div>
    );
};

export default ProductItem;
