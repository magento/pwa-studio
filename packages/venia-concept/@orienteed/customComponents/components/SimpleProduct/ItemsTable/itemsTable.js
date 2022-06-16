import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';
import Image from '@magento/venia-ui/lib/components/Image';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './itemsTable.module.css';
import CustomButton from '../CustomButtom/CustomButton';
import inStock from '../assets/inStock.svg';
import outOfStock from '../assets/outOfStock.svg';
import copyToClipboard from '../assets/copyToClipboard.png';
import useCopy from 'use-copy';
import CustomQuantityStepper from '../CustomQuantityStepper';

const ItemsTable = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        simpleProductData,
        errors,
        handleAddToCart,
        aggregations,
        tempTotalPrice,
        handleQuantityChange
    } = props;

    const [copied, copy, setCopied] = useCopy(simpleProductData.sku);

    const copyText = () => {
        copy();

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const [error, setError] = useState('');

    useEffect(() => {
        setTimeout(() => setError(''), 10000);
    }, [error]);

    const stockStatusText = (
        <FormattedMessage
            id={'productFullDetailB2B.stockStatus'}
            defaultMessage={'Stock Status'}
        />
    );

    const totalPriceText = (
        <FormattedMessage
            id={'productFullDetailB2B.totalPrice'}
            defaultMessage={'Total Price'}
        />
    );

    const imageIcon = widthSize => (
        <div className={classes.indexFixedImage}>
            <Image
                resource={simpleProductData.media_gallery_entries[0].file}
                width={widthSize}
                alt={simpleProductData.sku}
            />
        </div>
    );

    const priceTag = (
        <span className={classes.indexFixed}>
            <Price
                currencyCode={
                    simpleProductData.price.regularPrice.amount.currency
                }
                value={simpleProductData.price.minimalPrice.amount.value}
            />
        </span>
    );

    const stockStatus =
        simpleProductData.stock_status === 'IN_STOCK' ? (
            <div className={classes.inStockContainer}>
                <img src={inStock} alt="inStock" />
            </div>
        ) : (
            <div className={classes.outStockContainer}>
                <img src={outOfStock} alt="outOfStock" />
            </div>
        );

    const addToCartButton = (
        <CustomButton
            priority={'high'}
            classes={{ root: classes.buttonAddToCart }}
            onClick={handleAddToCart}
            disabled={simpleProductData.stock_status === 'OUT_OF_STOCK'}
        >
            <Icon
                classes={{
                    icon: classes.buttonAddToCartIcon
                }}
                size={16}
                src={ShoppingCartIcon}
            />
        </CustomButton>
    );

    const lastDigitsOfSku = simpleProductData.sku.substring(
        simpleProductData.sku.length - 7
    );

    const productItemDesktop = (
        <div className={classes.productItemErrorContainerDesktop}>
            <div className={classes.errorMessage}>
                {error != '' && <p>{errors.get('quantity')}</p>}
            </div>

            <div className={classes.productItemContainerDesktop}>
                {imageIcon(120)}
                <div className={classes.indexMobileSku}>
                    {copied ? (
                        <div className={classes.copiedText}>
                            <FormattedMessage
                                id={'productFullDetailB2B.copiedText'}
                                defaultMessage={'Copied'}
                            />
                        </div>
                    ) : (
                        <div className={classes.productSkuContainer}>
                            <p onClick={copyText}>...{lastDigitsOfSku}</p>
                            <img
                                src={copyToClipboard}
                                alt="copyToClipboard"
                                onClick={copyText}
                            />
                        </div>
                    )}
                </div>
                <div className={classes.categoriesItemList}>
                    {aggregations.map((category, i) => {
                        if (
                            category.label !== 'Category' &&
                            category.label !== 'Price'
                        ) {
                            return category.options.map(option => {
                                return (
                                    <p
                                        key={`${category.label}-${i}`}
                                        className={classes.indexFixedCategory}
                                    >
                                        {option.label}
                                    </p>
                                );
                            });
                        }
                    })}
                </div>
                <CustomQuantityStepper
                    fieldName={`${simpleProductData.sku}`}
                    classes={{ root: classes.quantityRoot }}
                    min={1}
                    onChange={handleQuantityChange}
                />
                {priceTag}
                <span className={classes.indexFixed}>{tempTotalPrice}</span>
                <div className={classes.stockAddContainer}>
                    {stockStatus}
                    {addToCartButton}
                </div>
            </div>
        </div>
    );

    const productItemMobile = (
        <main className={classes.productItemContainerMobile}>
            <div className={classes.productItemContainerMobileContent}>
                <section className={classes.productItemHeaderMobile}>
                    <div className={classes.productItemHeaderImageMobile}>
                        {imageIcon(150)}
                    </div>
                    <article className={classes.productItemHeaderTextMobile}>
                        <small className={classes.skuTextMobile}>
                            {simpleProductData.sku}
                        </small>
                        <div className={classes.stockStatusContainer}>
                            <div>{stockStatusText}:</div>
                            <div className={classes.stockStatusCircle}>
                                {stockStatus}
                            </div>
                        </div>
                        <h2>{priceTag}</h2>
                    </article>
                </section>

                {/* Body */}
                <section className={classes.productItemBodyInformation}>
                    <div className={classes.productItemBodyInformationRow}>
                        <article className={classes.mobileCategoryName}>
                            {' '}
                            {aggregations.map(category => {
                                if (
                                    category.label !== 'Category' &&
                                    category.label !== 'Price'
                                ) {
                                    return (
                                        <p key={category.label}>
                                            {category.label}
                                        </p>
                                    );
                                }
                            })}{' '}
                        </article>
                        <article className={classes.mobileCategoryValue}>
                            {aggregations.map((category, i) => {
                                if (
                                    category.label !== 'Category' &&
                                    category.label !== 'Price'
                                ) {
                                    return category.options.map(option => {
                                        return (
                                            <p key={`${category.label}-${i}`}>
                                                {option.label}
                                            </p>
                                        );
                                    });
                                }
                            })}
                        </article>
                    </div>
                </section>
                <section className={classes.actionsContainer}>
                    <article className={classes.totalPriceContainer}>
                        <div> {totalPriceText}:</div>
                        <div className={classes.totalWrapper}>
                            {' '}
                            <span className={classes.indexFixed}>
                                {tempTotalPrice}
                            </span>
                        </div>
                    </article>
                    <div className={classes.productItemBodyOperations}>
                        <CustomQuantityStepper
                            fieldName={`${simpleProductData.sku}`}
                            classes={{ root: classes.quantityRoot }}
                            min={1}
                            onChange={handleQuantityChange}
                        />
                        {addToCartButton}
                    </div>
                    {error != '' && (
                        <p style={{ color: '#f00' }}>
                            {errors.get('quantity')}
                        </p>
                    )}
                </section>
            </div>
        </main>
    );

    return (
        <div className={classes.productsTableContainer}>
            {productItemDesktop} {productItemMobile}
        </div>
    );
};

export default ItemsTable;
