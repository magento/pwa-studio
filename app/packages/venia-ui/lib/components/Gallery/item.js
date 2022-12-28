import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Info } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { string, number, shape } from 'prop-types';

import AddToCartButton from './addToCartButton';
import Button from '@magento/venia-ui/lib/components/Button';
import ConfirmationModal from '../RequestQuote/ConfirmationModal';
import GalleryItemShimmer from './item.shimmer';
import Image from '../Image';
import Price from '@magento/venia-ui/lib/components/Price';
import QuantityStepper from './QuantityStepper/quantity';
import Select from './SelectField/select';
import WishlistGalleryButton from '../Wishlist/AddToListButton';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import useCompareProduct from '@magento/peregrine/lib/talons/ComparePage/useCompareProduct';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useAddToQuote } from '@magento/peregrine/lib/talons/QuickOrderForm/useAddToQuote.js';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import { useStyle } from '../../classify';
import { useToasts } from '@magento/peregrine';

import defaultClasses from './item.module.css';

import CompareIcon from './Icons/compare.svg';
import InStockIcon from './Icons/inStock.svg';
import InfoIcon from './Icons/info.svg';
import OutStockIcon from './Icons/outStock.svg';
import ShareIcon from './Icons/share.svg';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const { handleLinkClick, item, wishlistButtonProps, isSupportedProductType } = useGalleryItem(props);
    const { storeConfig, filterState, pageBuilder } = props;
    const { configurable_options, stock_status } = props.item;
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { location } = useHistory();
    const history = useHistory();
    const isHomePage = location.pathname === '/';
    const [quantity, setQuantity] = useState(1);
    const [selectedVeriant, setSelectedVeriant] = useState();

    const compareProps = useCompareProduct();
    const { addProductsToCompare } = compareProps;

    const { handleAddCofigItemBySku } = useAddToQuote();
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

    const requestQuoteClick = () => {
        if (selectedVeriant?.parentSku) {
            setIsOpen(true);
        } else return history.push(productLink);
    };
    const confirmRequestQuote = () => {
        const simpleProducts = [
            {
                sku: selectedVeriant.product.sku,
                orParentSku: selectedVeriant.parentSku,
                quantity
            }
        ];
        handleAddCofigItemBySku(simpleProducts);
        setIsOpen(false);
    };
    const requestQuoteButton = (
        <div className={classes.requestBtn}>
            <Button disabled={item.stock_status === 'OUT_OF_STOCK'} onClick={requestQuoteClick} priority="high">
                <FormattedMessage id={'galleryItem.Requestquote'} defaultMessage={'Request quote'} />
            </Button>
        </div>
    );
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
                <span className={classes.configrableLabel}>{ele.label} </span>{' '}
                <Tippy
                    content={
                        <ul className={classes.list}>
                            {values.map(val => (
                                <li key={val}>{val}</li>
                            ))}
                        </ul>
                    }
                >
                    <img className={classes.attributeInfoIcon} src={InfoIcon} />
                </Tippy>
            </div>
        );
    });

    const StockStatus = ({ status }) => {
        return (
            <>
                {status === 'IN_STOCK' ? (
                    <span className={classes.inStock}>
                        <img src={InStockIcon} alt="in stock" />
                        <FormattedMessage id={'galleryItem.inStock'} defaultMessage={'In stock'} />
                    </span>
                ) : (
                    <span className={classes.outStock}>
                        <img src={OutStockIcon} alt="out stock" />
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
        return variant.attributes.map((attribute, i) => {
            return item.configurable_options[i].values.find(value => value.value_index == attribute.value_index).label;
        });
    };

    const onChangeVariant = e => setSelectedVeriant(JSON.parse(e.target.value));

    const getProductsInstance = () => {
        const instanceItem = { ...item };
        let variants = [...instanceItem?.variants];
        const filterKeys = filterState && [...filterState?.keys()];
        const filterValues = filterState && [...filterState?.values()];
        const filterValuesArray = filterValues?.map(filValue => {
            const valueArr = [];
            for (const valueObject of filValue) {
                valueArr.push(valueObject.value);
            }
            return valueArr;
        });
        const newVariants = [];
        if (filterKeys && filterValues?.length) {
            variants?.map(element => {
                const valueAttributes = element?.attributes?.map(({ value_index }) => value_index);
                const filter = filterValuesArray?.map(valArray =>
                    valArray.map(value => valueAttributes?.includes(parseInt(value)))
                );
                if (filter.map(filArray => filArray?.includes(true)).every(ele => ele === true))
                    newVariants.push(element);
            });
            variants = newVariants;
        }

        return variants.map(variant => ({
            ...variant,
            categoriesValuesName: getCategoriesValuesNameByVariant(variant),
            parentSku: item.sku,
            value:
                '....' +
                variant.product.sku.slice(variants[0].product.sku.length - 6) +
                ' ' +
                getCategoriesValuesNameByVariant(variant).join(' - ')
        }));
    };
    const customAttributes = () =>
        custom_attributes?.slice(0, 3).map(({ attribute_metadata, selected_attribute_options }) => {
            let labelValue = selected_attribute_options.attribute_option[0].label;
            labelValue.length > 15 ? (labelValue = labelValue.slice(0, 15) + '...') : labelValue;
            return (
                <div className={classes.customAttributes}>
                    <span>{attribute_metadata.label}:</span>
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
                    <img src={ShareIcon} alt="share icon" />
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
                    <span>
                        <FormattedMessage id={'galleryItem.yourPrice'} defaultMessage={'Your price:'} /> &nbsp;
                    </span>
                    {priceRender}
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
                                    initialValue={'Item'}
                                    field={`veriants ${item.sku}`}
                                    items={[{ value: 'Item' }, ...getProductsInstance()]}
                                    onChange={onChangeVariant}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
            <div className={`${classes.actionsContainer} ${isHomePage && classes.homeActionContainer}`}>
                {!price.minimalPrice?.amount.value && process.env.B2BSTORE_VERSION === 'PREMIUM'
                    ? requestQuoteButton
                    : addButton}
                <button className={classes.compareIcon} onClick={addToCompare}>
                    <img src={CompareIcon} alt="compare icon" />
                </button>
                <ConfirmationModal
                    isOpen={isOpen}
                    onCancel={() => setIsOpen(false)}
                    onConfirm={confirmRequestQuote}
                    product={selectedVeriant}
                    quantity={quantity}
                    setQuantity={val => setQuantity(val)}
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
