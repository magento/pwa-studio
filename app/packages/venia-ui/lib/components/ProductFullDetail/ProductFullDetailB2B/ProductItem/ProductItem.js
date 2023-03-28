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

import PlaceholderImage from '../../../Image/placeholderImage';
import { useFormState } from 'informed';

const ProductItem = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { values } = useFormState();

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
    const [isItemDisabled, setIsItemDisabled] = useState(false);

    const copyText = () => {
        navigator.clipboard.writeText(variant.product.sku);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const [error, setError] = useState('');

    useEffect(() => {
        setTimeout(() => setError(''), 10000);
    }, [error]);

    const handleAddProductToCart = useCallback(async () => {
        setIsItemDisabled(true);
        const variables = {
            cartId,
            quantity: values[(variant?.product.uid)],
            sku: variant.product.sku,
            parentSku: product.sku
        };
        try {
            await addConfigurableProductToCart({
                variables
            });
            setIsItemDisabled(false);
        } catch {
            setError('Error');
        }
    }, [cartId, values, variant, addConfigurableProductToCart, setError, product]);

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

    const quantitySelector = () => (
        <div className={classes.quantity}>
            <QuantityStepper
                fieldName={variant.product.uid}
                classes={{ root: classes.quantityRoot }}
                min={1}
                textProps={{ initialValue: 1 }}
            />
        </div>
    );

    const priceTag = (
        <span className={classes.indexFixed}>
            <Price
                currencyCode={variant.product.price.regularPrice.amount.currency}
                value={variant.product.price.minimalPrice.amount.value}
            />
        </span>
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
                variant.product.price?.minimalPrice?.amount?.value === -1 ||
                isItemDisabled
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

    const categoriesKeyValue = () => {
        const tempCategoriesKeyValueList = [];
        categoriesName.map((categoryName, i) => {
            return tempCategoriesKeyValueList.push([categoryName, categoriesValuesName[i]]);
        });
        return tempCategoriesKeyValueList;
    };
    // str.substring(str.length - n)
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
                            <button onClick={copyText}>
                                ...{lastDigitsOfSku} <img src={copyToClipboard} alt="copyToClipboard" />
                            </button>
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
                {variant?.product.stock_status === 'IN_STOCK' ? priceTag : <span>-</span>}
                {variant?.product.stock_status === 'IN_STOCK' ? (
                    <span className={classes.indexFixed}>
                        <Price
                            currencyCode={variant.product.price.regularPrice.amount.currency}
                            value={variant.product.price.minimalPrice.amount.value * values[(variant?.product.uid)]}
                        />
                    </span>
                ) : (
                    <span>-</span>
                )}
                <div className={classes.stockAddContainer}>
                    {stockStatus}
                    {addToCartButton}
                </div>
            </div>
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
                        {variant?.product.stock_status === 'IN_STOCK' && <h2>{priceTag}</h2>}
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
                    {variant?.product.stock_status === 'IN_STOCK' && (
                        <div className={classes.totalPriceContainer}>
                            <div> {totalPriceText}:</div>
                            <div className={classes.totalWrapper}>
                                <span className={classes.indexFixed}>
                                    <Price
                                        currencyCode={variant.product.price.regularPrice.amount.currency}
                                        value={
                                            variant.product.price.minimalPrice.amount.value *
                                            values[(variant?.product.uid)]
                                        }
                                    />
                                </span>
                            </div>
                        </div>
                    )}
                    <div className={classes.productItemBodyOperations}>
                        {quantitySelector(2)}
                        {addToCartButton}
                    </div>
                    {error != '' && <p style={{ color: '#f00' }}>{errors.get('quantity')}</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {productItemDesktop} {productItemMobile}
        </div>
    );
};

export default ProductItem;
