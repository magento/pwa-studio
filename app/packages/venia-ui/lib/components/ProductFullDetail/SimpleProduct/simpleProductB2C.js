import React, { Fragment, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
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

const SimpleProductB2C = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        simpleProductData,
        handleAddToCart,
        priceRender,
        errors,
        tempTotalPrice,
        wishlistButton,
        simpleProductAggregationFiltered,
        handleQuantityChange
    } = props;

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

    return (
        <Fragment>
            <Breadcrumbs categoryId={simpleProductData.categories[0].uid} currentProduct={simpleProductData.name} />
            <Form className={classes.root} onSubmit={handleAddToCart}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{simpleProductData.name}</h1>
                </section>
                <article className={classes.priceContainer}> {priceRender}</article>
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
                        <article className={classes.totalPrice}>{tempTotalPrice}</article>
                    </article>
                    {productAlertStatus?.mp_productalerts_price_alert && stockStatus === 'IN_STOCK' && (
                        <div className={classes.notifyPriceContainer}>
                            <NotifyPrice handleOpenPriceModal={handleOpenPriceModal} />
                        </div>
                    )}

                    {productAlertStatus?.mp_productalerts_stock_notify && (
                        <div className={classes.notifyButton}>
                            <NotifyButton
                                handleOpendStockModal={handleOpendStockModal}
                                simpleProductData={simpleProductData}
                            />
                        </div>
                    )}
                </section>
                <section className={classes.actions}>
                    <Button
                        className={classes.addToCartButton}
                        type="submit"
                        disabled={
                            simpleProductData.price?.minimalPrice?.amount?.value === -1 ||
                            simpleProductData.price?.regularPrice?.amount?.value === -1
                        }
                    >
                        {cartCallToActionText}
                    </Button>
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
                <section className={classes.details}>
                    <span className={classes.detailsTitle}>
                        <FormattedMessage id={'global.sku'} defaultMessage={'SKU'} />
                    </span>
                    <strong>{simpleProductData.sku}</strong>
                </section>
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
