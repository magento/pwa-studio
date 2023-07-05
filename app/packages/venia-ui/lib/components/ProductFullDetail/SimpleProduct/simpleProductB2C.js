import React, { Fragment, Suspense, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import QuantityStepper from '@magento/venia-ui/lib/components/QuantityStepper';
import defaultClasses from './simpleProductB2C.module.css';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Options from '../CustomProductOptions/options';
import Button from '../../Button';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';
import NotifyPrice from '../../ProductsAlert/NotifyPrice';
import PriceAlert from '../../ProductsAlert/PriceAlertModal/priceAlert';
import NotifyButton from '../../ProductsAlert/NotifyButton/NotifyButton';
import StockAlert from '../../ProductsAlert/StockAlertModal/stockAlert';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertTriangle, Eye } from 'react-feather';

const OfflineIcon = <Icon src={AlertTriangle} attrs={{ width: 18 }} />;

import AvailableStore from '../../StoreLocator/AvailableStore';

const SimpleProductB2C = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const [isOpenStoresModal, setIsOpenStoresModal] = useState(false);
    const {
        simpleProductData,
        handleAddToCart,
        priceRender,
        errors,
        tempTotalPrice,
        wishlistButton,
        simpleProductAggregationFiltered,
        handleQuantityChange,
        isAddConfigurableLoading
    } = props;

    const [{ isSignedIn }] = useUserContext();

    const { mp_attachments } = simpleProductData;
    const productsAlert = useProductsAlert({ simpleProductData });
    const {
        isStockModalOpened,
        handleOpendStockModal,
        handleCloseModal,
        handleOpenPriceModal,
        openPriceModal,
        submitStockAlert,
        handleSubmitPriceAlert,
        alertConfig
    } = productsAlert;
    const productAlertStatus = simpleProductData?.mp_product_alert;
    const stockStatus = simpleProductData?.stock_status;

    const cartCallToActionText =
        simpleProductData.stock_status === 'IN_STOCK' ? (
            <FormattedMessage id="productFullDetail.addItemToCart" defaultMessage="Add to Cart" />
        ) : (
            <FormattedMessage id="productFullDetail.itemOutOfStock" defaultMessage="Out of Stock" />
        );

    // reutrn true if the login is requierd to see the attachment
    const checkAttachmentLogin = note => note === 'Login required' && isSignedIn;

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

    const productAttachments = useMemo(() => {
        const previewIcon = <Icon src={Eye} size={20} />;
        return mp_attachments?.map(att => (
            <React.Fragment key={att.file_name}>
                <span>
                    <img height="20px" width="20" src={att.file_icon} alt={att.name} />
                    {att.note === '' || checkAttachmentLogin(att.note) ? (
                        <a href={att.url_file} target="_blank">
                            {previewIcon}
                        </a>
                    ) : (
                        <button type="button" onClick={loginRequiredClick}>
                            {previewIcon}
                        </button>
                    )}

                    {att.file_name}
                </span>
            </React.Fragment>
        ));
    }, [mp_attachments, isSignedIn]);

    return (
        <Fragment>
            <Breadcrumbs
                productSku={simpleProductData?.sku}
                categoryId={simpleProductData.categories[0].uid}
                currentProduct={simpleProductData.name}
            />
            <Form className={classes.root} onSubmit={handleAddToCart}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{simpleProductData.name}</h1>
                </section>
                {simpleProductData.stock_status === 'IN_STOCK' && (
                    <article className={classes.priceContainer}>
                        {' '}
                        {priceRender}
                        {simpleProductData?.mp_pickup_locations?.length > 0 && (
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
                <section className={classes.imageCarousel}>
                    <Carousel images={simpleProductData.media_gallery_entries} carouselWidth={960} />
                </section>

                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />

                <Options simpleProductAggregationFiltered={simpleProductAggregationFiltered} />

                <section className={classes.quantity}>
                    <span className={classes.quantityTitle}>
                        <FormattedMessage id={'global.quantity'} defaultMessage={'Quantity'} />
                    </span>
                    <article className={classes.quantityTotalPrice}>
                        <QuantityStepper
                            fieldName={`${simpleProductData.sku}`}
                            classes={{ root: classes.quantityRoot }}
                            min={1}
                            onChange={handleQuantityChange}
                        />
                        {simpleProductData.stock_status === 'IN_STOCK' && (
                            <article className={classes.totalPrice}>{tempTotalPrice}</article>
                        )}
                    </article>
                    {productAlertStatus?.mp_productalerts_price_alert &&
                        stockStatus === 'IN_STOCK' &&
                        process.env.B2BSTORE_VERSION === 'PREMIUM' && (
                            <div className={classes.notifyPriceContainer}>
                                <NotifyPrice handleOpenPriceModal={handleOpenPriceModal} />
                            </div>
                        )}
                </section>
                <section className={classes.actions}>
                    {productAlertStatus?.mp_productalerts_stock_notify &&
                    stockStatus !== 'IN_STOCK' &&
                    process.env.B2BSTORE_VERSION === 'PREMIUM' ? (
                        <div className={classes.notifyButton}>
                            <NotifyButton
                                handleOpendStockModal={handleOpendStockModal}
                                simpleProductData={simpleProductData}
                            />
                        </div>
                    ) : (
                        <Button
                            className={classes.addToCartButton}
                            type="submit"
                            disabled={
                                simpleProductData.price?.minimalPrice?.amount?.value === -1 ||
                                simpleProductData.price?.regularPrice?.amount?.value === -1 ||
                                isAddConfigurableLoading
                            }
                        >
                            {cartCallToActionText}
                        </Button>
                    )}

                    <section className={classes.favoritesButton}>
                        <Suspense fallback={null}>{wishlistButton}</Suspense>
                    </section>
                </section>
                <section className={classes.description}>
                    <span className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </span>
                    <RichContent html={simpleProductData.description.html} />
                </section>
                <div className={classes.attachmentWrapper}>{productAttachments}</div>
                <section className={classes.details}>
                    <span className={classes.detailsTitle}>
                        <FormattedMessage id={'global.sku'} defaultMessage={'SKU'} />
                    </span>
                    <strong>{simpleProductData.sku}</strong>
                </section>
                {isOpenStoresModal && (
                    <AvailableStore
                        isOpen={isOpenStoresModal}
                        onCancel={() => setIsOpenStoresModal(false)}
                        storesList={simpleProductData?.mp_pickup_locations}
                    />
                )}
            </Form>
            <PriceAlert
                isOpen={openPriceModal}
                onCancel={handleCloseModal}
                onConfirm={handleSubmitPriceAlert}
                alertConfig={alertConfig?.price_alert}
            />

            <StockAlert
                isOpen={isStockModalOpened}
                onCancel={handleCloseModal}
                onConfirm={submitStockAlert}
                alertConfig={alertConfig?.stock_alert}
            />
        </Fragment>
    );
};
//
export default SimpleProductB2C;
