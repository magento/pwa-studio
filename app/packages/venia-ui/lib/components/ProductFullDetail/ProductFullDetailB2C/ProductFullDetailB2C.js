/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, Suspense, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import QuantityStepper from '@magento/venia-ui/lib/components/QuantityStepper';
import CustomAttributes from '@magento/venia-ui/lib/components/ProductFullDetail/CustomAttributes';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';
import Select from '../../Select';

const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));

import defaultClasses from './ProductFullDetailB2C.module.css';
import noImage from '@magento/venia-ui/lib/assets/product-package-cancelled.svg';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertTriangle, Eye } from 'react-feather';
import { useToasts } from '@magento/peregrine';

const previewIcon = <Icon src={Eye} size={20} />;
const OfflineIcon = <Icon src={AlertTriangle} attrs={{ width: 18 }} />;
import NotifyPrice from '../../ProductsAlert/NotifyPrice';
import PriceAlert from '../../ProductsAlert/PriceAlertModal/priceAlert';
import NotifyButton from '../../ProductsAlert/NotifyButton/NotifyButton';
import StockAlert from '../../ProductsAlert/StockAlertModal/stockAlert';

import AvailableStore from '../../StoreLocator/AvailableStore';
const ProductFullDetailB2C = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [isOpenStoresModal, setIsOpenStoresModal] = useState(false);

    const [, { addToast }] = useToasts();

    const {
        breadcrumbs,
        errors,
        handleAddToCart,
        productDetails,
        priceRender,
        mediaGalleryEntries,
        availableOptions,
        hasOptionsOfTheSelection,
        wishlistButtonProps,
        handleQuantityChange,
        tempTotalPrice,
        cartActionContent,
        customAttributes,
        product,
        isOutOfStock,
        isSimpleProductSelected,
        selectedVarient,
        isOutOfStockProduct
    } = props;

    const productAlertStatus = selectedVarient?.product?.mp_product_alert;

    const productsAlert = useProductsAlert({ isOutOfStockProduct, selectedVarient });

    const {
        isStockModalOpened,
        handleOpendStockModal,
        handleCloseModal,
        handleOpenPriceModal,
        openPriceModal,
        outStockProductsSku,
        handleChangeProductSku,
        selectedOptionB2C,
        submitStockAlert,
        handleSubmitPriceAlert,
        alertConfig
    } = productsAlert;

    const [{ isSignedIn }] = useUserContext();
    const { mp_attachments } = productDetails;
    // reutrn true if the login is requierd to see the attachment
    const checkAttachmentLogin = note => note === 'Login required';

    const loginRequiredClick = () =>
        addToast({
            icon: OfflineIcon,
            type: 'error',
            message: formatMessage({
                id: 'productAttachemts.loginRequired',
                defaultMessage: 'Login required'
            }),
            timeout: 3000
        });

    const productAttachments = useMemo(
        () =>
            mp_attachments?.map(att => (
                <>
                    <span key={att.file_name}>
                        <img height="20px" width="20" src={att.file_icon} alt={att.name} />
                        {att.note === '' || (checkAttachmentLogin(att.note) && isSignedIn) ? (
                            <a href={att.url_file} target="_blank">
                                {previewIcon}
                            </a>
                        ) : (
                            <button onClick={loginRequiredClick}>{previewIcon}</button>
                        )}

                        {att.file_name}
                    </span>
                </>
            )),
        [mp_attachments, isSignedIn]
    );
    const customAttributesDetails = useMemo(() => {
        const list = [];
        const pagebuilder = [];
        const skuAttribute = {
            attribute_metadata: {
                uid: 'attribute_sku',
                used_in_components: ['PRODUCT_DETAILS_PAGE'],
                ui_input: {
                    ui_input_type: 'TEXT'
                },
                label: formatMessage({
                    id: 'global.sku',
                    defaultMessage: 'SKU'
                })
            },
            entered_attribute_value: {
                value: productDetails.sku
            }
        };
        if (Array.isArray(customAttributes)) {
            customAttributes.forEach(customAttribute => {
                if (customAttribute.attribute_metadata.ui_input.ui_input_type === 'PAGEBUILDER') {
                    pagebuilder.push(customAttribute);
                } else {
                    list.push(customAttribute);
                }
            });
        }
        list.unshift(skuAttribute);
        return {
            list: list,
            pagebuilder: pagebuilder
        };
    }, [customAttributes, productDetails.sku, formatMessage]);

    const shortDescription = productDetails.shortDescription ? (
        <RichContent html={productDetails.shortDescription.html} />
    ) : null;

    const pageBuilderAttributes = customAttributesDetails.pagebuilder.length ? (
        <section className={classes.detailsPageBuilder}>
            <CustomAttributes
                classes={{ list: classes.detailsPageBuilderList }}
                customAttributes={customAttributesDetails.pagebuilder}
                showLabels={false}
            />
        </section>
    ) : null;
    const shouldRenderPrice =
        (!isSimpleProductSelected && product?.stock_status === 'IN_STOCK') ||
        (isSimpleProductSelected && !isOutOfStock);

    const notifyText = !selectedVarient && (
        <div className={classes.notifyContainer}>
            <FormattedMessage id={'notifyAlert'} defaultMessage={'To notify, select all the options for the product'} />
        </div>
    );
    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root} data-cy="ProductFullDetail-root" onSubmit={handleAddToCart}>
                <section className={classes.title}>
                    <h1 className={classes.productName} data-cy="ProductFullDetail-productName">
                        {productDetails.name}
                    </h1>

                    {shortDescription}
                </section>
                {shouldRenderPrice && (
                        <article className={classes.priceContainer}>
                            {priceRender}
                            {product?.mp_pickup_locations?.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setIsOpenStoresModal(true)}
                                    className={classes.storeButtion}
                                >
                                    <FormattedMessage
                                        id={'storeLocator.SeeAvailablePickupStores'}
                                        defaultMessage={'See available pickup stores'}
                                    />
                                </button>
                            )}
                        </article>
                )}
                <div className={classes.imageCarousel}>
                    {hasOptionsOfTheSelection ? (
                        <Carousel images={mediaGalleryEntries} carouselWidth={960} />
                    ) : (
                        <div className={classes.noImageContainer}>
                            <img className={classes.noImage} src={noImage} alt="NoImage" />
                        </div>
                    )}
                </div>
                {!hasOptionsOfTheSelection ? (
                    <div className={classes.errorOptionCombination}>
                        <FormattedMessage
                            id="productFullDetail.errorOptionCombination"
                            defaultMessage="This combination of options doesn't exist."
                        />
                    </div>
                ) : null}
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <section className={classes.options}>{availableOptions}</section>
                <section className={classes.quantity}>
                    <span data-cy="ProductFullDetail-quantityTitle" className={classes.quantityTitle}>
                        <FormattedMessage id={'global.quantity'} defaultMessage={'Quantity'} />
                    </span>
                    <article className={classes.quantityTotalPrice}>
                        <QuantityStepper
                            fieldName={'quantity'}
                            classes={{ root: classes.quantityRoot }}
                            min={1}
                            onChange={handleQuantityChange}
                            message={errors.get('quantity')}
                        />

                        {shouldRenderPrice && <article className={classes.totalPrice}>{tempTotalPrice}</article>}
                    </article>
                    {productAlertStatus?.mp_productalerts_price_alert && process.env.B2BSTORE_VERSION === 'PREMIUM' && (
                        <div className={classes.notifyPriceContainer}>
                            <NotifyPrice handleOpenPriceModal={handleOpenPriceModal} />
                        </div>
                    )}

                    {productAlertStatus?.mp_productalerts_stock_notify &&
                        isOutOfStockProduct.length > 0 &&
                        process.env.B2BSTORE_VERSION === 'PREMIUM' && (
                            <div className={classes.selectB2cProduct}>
                                <div className={classes.notifySelect}>
                                    <Select
                                        initialValue={outStockProductsSku[0]}
                                        field="selection"
                                        items={outStockProductsSku}
                                        onChange={e => handleChangeProductSku(e.target.value)}
                                    />
                                </div>
                                <div className={classes.notifyButton}>
                                    <NotifyButton
                                        handleOpendStockModal={handleOpendStockModal}
                                        productStatus={selectedVarient?.product?.stock_status}
                                        selectedOptionB2C={selectedOptionB2C}
                                        disabled={!selectedOptionB2C}
                                    />
                                </div>
                                <>{notifyText}</>
                            </div>
                        )}
                </section>
                <section className={classes.actions}>
                    {cartActionContent}
                    <Suspense fallback={null}>
                        <WishlistButton {...wishlistButtonProps} />
                    </Suspense>
                </section>
                <section className={classes.description}>
                    <span data-cy="ProductFullDetail-descriptionTitle" className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </span>
                    <RichContent html={productDetails.description} />
                </section>
                {productAttachments?.length > 0 && (
                    <div className={classes.attachmentWrapper}>{productAttachments}</div>
                )}
                <section className={classes.details}>
                    <CustomAttributes customAttributes={customAttributesDetails.list} />
                </section>
                {pageBuilderAttributes}
                {isOpenStoresModal && (
                    <AvailableStore
                        isOpen={isOpenStoresModal}
                        onCancel={() => setIsOpenStoresModal(false)}
                        storesList={product?.mp_pickup_locations}
                    />
                )}
            </Form>
            {selectedVarient && (
                <PriceAlert
                    isOpen={openPriceModal}
                    onCancel={handleCloseModal}
                    onConfirm={handleSubmitPriceAlert}
                    alertConfig={alertConfig?.price_alert}
                />
            )}
            <StockAlert
                alertConfig={alertConfig?.stock_alert}
                isOpen={isStockModalOpened}
                onCancel={handleCloseModal}
                onConfirm={submitStockAlert}
            />
        </Fragment>
    );
};

export default ProductFullDetailB2C;
