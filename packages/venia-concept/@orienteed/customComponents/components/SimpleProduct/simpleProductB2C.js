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
import CustomButton from './SimpleProductB2CButton/CustomButton';

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

    const cartCallToActionText =
        simpleProductData.stock_status === 'IN_STOCK' ? (
            <FormattedMessage
                id="productFullDetail.addItemToCart"
                defaultMessage="Add to Cart"
            />
        ) : (
            <FormattedMessage
                id="productFullDetail.itemOutOfStock"
                defaultMessage="Out of Stock"
            />
        );
    return (
        <Fragment>
            <Breadcrumbs
                categoryId={simpleProductData.categories[0].uid}
                currentProduct={simpleProductData.name}
            />
            <Form className={classes.root} onSubmit={handleAddToCart}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        {simpleProductData.name}
                    </h1>
                </section>
                <article className={classes.priceContainer}>
                    {' '}
                    {priceRender}
                </article>
                <section className={classes.imageCarousel}>
                    <Carousel
                        images={simpleProductData.media_gallery_entries}
                    />
                </section>

                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />

                <Options
                    simpleProductAggregationFiltered={
                        simpleProductAggregationFiltered
                    }
                />

                <section className={classes.quantity}>
                    <span className={classes.quantityTitle}>
                        <FormattedMessage
                            id={'global.quantity'}
                            defaultMessage={'Quantity'}
                        />
                    </span>
                    <article className={classes.quantityTotalPrice}>
                        <QuantityStepper
                            fieldName={`${simpleProductData.sku}`}
                            classes={{ root: classes.quantityRoot }}
                            min={1}
                            onChange={handleQuantityChange}
                        />
                        <article className={classes.totalPrice}>
                            {tempTotalPrice}
                        </article>
                    </article>
                </section>
                <section className={classes.actions}>
                    <CustomButton priority="high" type="submit">
                        {cartCallToActionText}
                    </CustomButton>
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
                        <FormattedMessage
                            id={'global.sku'}
                            defaultMessage={'SKU'}
                        />
                    </span>
                    <strong>{simpleProductData.sku}</strong>
                </section>
            </Form>
        </Fragment>
    );
};

export default SimpleProductB2C;
