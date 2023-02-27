import React, { Fragment, Suspense, useMemo } from 'react';
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

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertTriangle, Eye } from 'react-feather';

const OfflineIcon = <Icon src={AlertTriangle} attrs={{ width: 18 }} />;

const SimpleProductB2C = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

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

    const [{ isSignedIn }] = useUserContext();

    const { mp_attachments } = simpleProductData;

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
                        <a href={att.url_file} target="blank">
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
                <div className={classes.attachmentWrapper}>{productAttachments}</div>
                <section className={classes.details}>
                    <span className={classes.detailsTitle}>
                        <FormattedMessage id={'global.sku'} defaultMessage={'SKU'} />
                    </span>
                    <strong>{simpleProductData.sku}</strong>
                </section>
            </Form>
        </Fragment>
    );
};

export default SimpleProductB2C;
