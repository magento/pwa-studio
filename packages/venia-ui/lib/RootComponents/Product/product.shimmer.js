import React, { useMemo } from 'react';
import { string } from 'prop-types';
import Shimmer from '../../components/Shimmer';
import { BreadcrumbShimmer } from '../../components/Breadcrumbs';
import defaultClasses from '../../components/ProductFullDetail/productFullDetail.css';
import { useStyle } from '../../classify';

const ProductShimmer = (props) => {
    const { productType } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const options = useMemo(() => {
        if (productType.includes('Configurable')) {
            // TODO return different shimmer structure
            return (
                <Shimmer />
            );
        }

        return null;
    }, [productType]);

    return (
        <Fragment>
            <BreadcrumbShimmer />
            <div className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        {productDetails.name}
                    </h1>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={productDetails.price.currency}
                            value={productDetails.price.value}
                        />
                    </p>
                </section>
                <section className={classes.imageCarousel}>
                    <Carousel images={mediaGalleryEntries} />
                </section>
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <section className={classes.options}>{options}</section>
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>
                        <FormattedMessage
                            id={'global.quantity'}
                            defaultMessage={'Quantity'}
                        />
                    </h2>
                    <QuantityFields
                        classes={{ root: classes.quantityRoot }}
                        min={1}
                        message={errors.get('quantity')}
                    />
                </section>
                <section className={classes.actions}>
                    {cartActionContent}
                    <Suspense fallback={null}>
                        <WishlistButton {...wishlistButtonProps} />
                    </Suspense>
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </h2>
                    <RichText content={productDetails.description} />
                </section>
                <section className={classes.details}>
                    <h2 className={classes.detailsTitle}>
                        <FormattedMessage
                            id={'global.sku'}
                            defaultMessage={'SKU'}
                        />
                    </h2>
                    <strong>{productDetails.sku}</strong>
                </section>
            </div>
        </Fragment>
    );
};

ProductShimmer.propTypes = {
    productType: string.required
};

export default ProductShimmer;
