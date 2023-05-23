import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Info } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { string, number, shape } from 'prop-types';

import AddToCartButton from './addToCartButton';
import GalleryItemShimmer from './item.shimmer';
import Image from '../Image';
import Price from '@magento/venia-ui/lib/components/Price';
import QuantityStepper from './QuantityStepper/quantity';
import Select from './SelectField/select';
import WishlistGalleryButton from '../Wishlist/AddToListButton';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import useCompareProduct from '@magento/peregrine/lib/talons/ComparePage/useCompareProduct';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import { useStyle } from '../../classify';
import { useToasts } from '@magento/peregrine';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';
import StockAlertModal from '@magento/venia-ui/lib/components/ProductsAlert/StockAlertModal';

import defaultClasses from './item.module.css';

import { CompareIcon } from '@magento/venia-ui/lib/assets/compareIcon';
import { InStockIcon } from '@magento/venia-ui/lib/assets/inStockIcon';
import InfoIcon from '@magento/venia-ui/lib/assets/info.svg';
import { OutStockIcon } from '@magento/venia-ui/lib/assets/outStockIcon';
import { ShareIcon } from '@magento/venia-ui/lib/assets/shareIcon';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const { handleLinkClick, item, wishlistButtonProps, isSupportedProductType } = useGalleryItem(props);
    const { storeConfig, pageBuilder } = props;
    const { configurable_options, stock_status } = props.item;
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const [{ isSignedIn }] = useUserContext();

    const classes = useStyle(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { location } = useHistory();
    const isHomePage = location.pathname === '/';
    const [quantity, setQuantity] = useState(1);
    const [selectedVeriant, setSelectedVeriant] = useState();

    const compareProps = useCompareProduct();
    const { addProductsToCompare } = compareProps;

    const productsAlert = useProductsAlert({ ItemSku: item.sku });
    const {
        formProps,
        isStockModalOpened,
        setisStockModalOpened,
        submitStockAlert,
        handleOpendStockModal,
        isUserSignIn,
        alertConfig
    } = productsAlert;

    const [isOpen, setIsOpen] = useState(false);
    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const { name, price, small_image, url_key, custom_attributes } = item;
    const { url: smallImageURL } = small_image;

    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const simpleProductLink = `/simple-product?sku=${item.sku}`;
    const {
        minimalPrice: {
            amount: { currency: minimalPriceCurrency, value: minimalPriceValue }
        },
        regularPrice: {
            amount: { value: regularPriceValue }
        }
    } = price;
    const discount = Math.round(100 - (price.minimalPrice?.amount.value / price.regularPrice?.amount.value) * 100);
    const priceRender =
        minimalPriceValue === regularPriceValue ? (
            <div className={`${classes.price} ${classes.regularPrice}`}>
                <Price value={price.regularPrice.amount.value} currencyCode={price.regularPrice.amount.currency} />
            </div>
        ) : (
            <div className={classes.priceWrapper}>
                <div className={classes.oldPrice}>
                    <Price value={price.regularPrice.amount.value} currencyCode={price.regularPrice.amount.currency} />
                </div>
                <div className={`${classes.price} ${classes.newPrice}`}>
                    <Price value={minimalPriceValue} currencyCode={minimalPriceCurrency} />
                </div>
            </div>
        );

    const wishlistButton = wishlistButtonProps ? <WishlistGalleryButton {...wishlistButtonProps} /> : null;

    const addButton = isSupportedProductType ? (
        <AddToCartButton
            item={
                selectedVeriant
                    ? {
                          ...selectedVeriant.product,
                          parentSku: selectedVeriant.parentSku
                      }
                    : item
            }
            urlSuffix={productUrlSuffix}
            quantity={quantity}
            handleOpendStockModal={handleOpendStockModal}
            isProductAlertEnabled={item?.mp_product_alert}
        />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).
    const ratingAverage = null;

    const configurableOptions = configurable_options?.map((ele, key) => {
        const values = ele.values.map(({ default_label }) => default_label);
        return (
            <div className={classes.configurableWrapper} key={key + 'configurable_options'}>
                <span className={classes.configrableLabel}>{ele?.label} </span>{' '}
                <Tippy
                    content={
                        <ul className={classes.list}>
                            {values.map(val => (
                                <li key={val}>{val}</li>
                            ))}
                        </ul>
                    }
                >
                    <img className={classes.attributeInfoIcon} src={InfoIcon} alt="InfoIcon" />
                </Tippy>
            </div>
        );
    });

    const StockStatus = ({ status }) => {
        return (
            <>
                {status === 'IN_STOCK' ? (
                    <span className={classes.inStock}>
                        <InStockIcon />
                        <FormattedMessage id={'galleryItem.inStock'} defaultMessage={'In stock'} />
                    </span>
                ) : (
                    <span className={classes.outStock}>
                        <OutStockIcon />
                        <FormattedMessage id={'galleryItem.outStock'} defaultMessage={'Out of stock'} />
                    </span>
                )}
            </>
        );
    };

    const shareClick = () => {
        navigator.clipboard.writeText(window.origin + productLink);
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'quickOrder.copiedUrl',
                defaultMessage: 'The product URL was copied to the clipboard'
            })
        });
    };
    const onChangeQty = value => setQuantity(value);

    const getCategoriesValuesNameByVariant = variant => {
        return variant.attributes.map(attribute => {
            return item.configurable_options
                ?.find(({ attribute_code }) => attribute_code === attribute?.code)
                .values.find(value => value.value_index == attribute.value_index)?.label;
        });
    };

    const onChangeVariant = e => setSelectedVeriant(JSON.parse(e.target.value));

    const getProductsInstance = () => {
        const instanceItem = { ...item };

        const variants = [...instanceItem?.variants];

        return variants.map(variant => ({
            ...variant,
            categoriesValuesName: getCategoriesValuesNameByVariant(variant),
            parentSku: item.sku,
            value:
                '....' +
                variant.product.sku.slice(variants[0].product.sku?.length - 6) +
                ' ' +
                getCategoriesValuesNameByVariant(variant).join(' - ')
        }));
    };
    const customAttributes = () =>
        custom_attributes?.slice(0, 3).map(({ attribute_metadata, selected_attribute_options }) => {
            let labelValue = selected_attribute_options.attribute_option[0]?.label;
            labelValue?.length > 15 ? (labelValue = labelValue.slice(0, 15) + '...') : labelValue;
            return (
                <div className={classes.customAttributes}>
                    <span>{attribute_metadata?.label}:</span>
                    <span>{labelValue}</span>
                </div>
            );
        });

    const addToCompare = () => {
        addProductsToCompare(item);
    };

    return (
        <div data-cy="GalleryItem-root" className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.images}>
                {item.__typename === 'ConfigurableProduct' ? (
                    <Link
                        onClick={handleLinkClick}
                        to={{
                            pathname: productLink,
                            state: {
                                prevPath: location.pathname,
                                urlKeys: props.urlKeys
                            }
                        }}
                    >
                        <Image
                            alt={name}
                            classes={{
                                image: classes.image,
                                loaded: classes.imageLoaded,
                                notLoaded: classes.imageNotLoaded,
                                root: classes.imageContainer
                            }}
                            height={IMAGE_HEIGHT}
                            resource={smallImageURL}
                            widths={IMAGE_WIDTHS}
                        />
                    </Link>
                ) : (
                    <Link onClick={handleLinkClick} to={simpleProductLink}>
                        <Image
                            alt={name}
                            classes={{
                                image: classes.image,
                                loaded: classes.imageLoaded,
                                notLoaded: classes.imageNotLoaded,
                                root: classes.imageContainer
                            }}
                            height={IMAGE_HEIGHT}
                            resource={smallImageURL}
                            widths={IMAGE_WIDTHS}
                        />
                    </Link>
                )}
                {discount ? (
                    <div className={classes.discount}>
                        <span>{discount}%</span>
                    </div>
                ) : null}
                <div className={classes.favIcon}>{wishlistButton}</div>
                <div onClick={shareClick} className={classes.shareIcon}>
                    <ShareIcon />
                </div>
                <div className={classes.stockIcon}>
                    <StockStatus status={stock_status} />
                </div>
                {ratingAverage}
            </div>
            <Link
                onClick={handleLinkClick}
                to={{
                    pathname: item.__typename === 'ConfigurableProduct' ? productLink : simpleProductLink,
                    state: {
                        prevPath: location.pathname,
                        urlKeys: props.urlKeys
                    }
                }}
                className={classes.name}
                data-cy="GalleryItem-name"
            >
                <span>{name}</span>
            </Link>
            <div data-cy="GalleryItem-price" className={classes.price}>
                {!pageBuilder && (
                    <div className={classes.configurableOptions}>
                        {!isHomePage && configurableOptions}
                        {custom_attributes?.length > 0 && customAttributes()}
                    </div>
                )}
                <div className={classes.productPrice}>
                    {stock_status === 'IN_STOCK' && (
                        <>
                            <span>
                                <FormattedMessage id={'galleryItem.yourPrice'} defaultMessage={'Your price:'} /> &nbsp;
                            </span>
                            {priceRender}
                        </>
                    )}
                </div>
            </div>
            {!pageBuilder && (
                <div className={classes.productsWrapper}>
                    {location.search && item?.variants && (
                        <>
                            <div className={classes.qtyField}>
                                <QuantityStepper value={quantity} onChange={e => onChangeQty(e)} min={1} />
                            </div>
                            <div className={classes.productsSelect}>
                                <Select
                                    field={`veriants ${item.sku}`}
                                    items={[
                                        {
                                            value: formatMessage({
                                                id: 'galleryItem.Item',
                                                defaultMessage: 'Select an item'
                                            })
                                        },
                                        ...getProductsInstance()
                                    ]}
                                    onChange={onChangeVariant}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
            <div
                className={`${classes.actionsContainer} ${isHomePage && classes.homeActionContainer}  ${isSignedIn &&
                    classes.multibaleActions}`}
            >
                {addButton}
                {isSignedIn && (
                    <button className={classes.compareIcon} onClick={addToCompare}>
                        <CompareIcon />
                    </button>
                )}
                <StockAlertModal
                    onCancel={() => setisStockModalOpened(false)}
                    isOpen={isStockModalOpened}
                    onConfirm={submitStockAlert}
                    formProps={formProps}
                    isUserSignIn={isUserSignIn}
                    alertConfig={alertConfig?.stock_alert}
                />
                {/* {!isHomePage && wishlistButton} */}
            </div>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string.isRequired
    })
};

export default GalleryItem;
