/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import QuantityStepper from '@magento/venia-ui/lib/components/QuantityStepper';
import CustomAttributes from '@magento/venia-ui/lib/components/ProductFullDetail/CustomAttributes';

const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));

import defaultClasses from './ProductFullDetailB2C.module.css';
import noImage from './icons/product-package-cancelled.svg';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertTriangle, Eye } from 'react-feather';
import { useToasts } from '@magento/peregrine';

const previewIcon = <Icon src={Eye} size={20} />;
const OfflineIcon = <Icon src={AlertTriangle} attrs={{ width: 18 }} />;

const ProductFullDetailB2C = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

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
        customAttributes
    } = props;

    const [{ isSignedIn }] = useUserContext();
    const { mp_attachments } = productDetails;
    console.log({ mp_attachments });
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
                            <a href={att.url_file} target="blank">
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

    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root} data-cy="ProductFullDetail-root" onSubmit={handleAddToCart}>
                <section className={classes.title}>
                    <h1 className={classes.productName} data-cy="ProductFullDetail-productName">
                        {productDetails.name}
                    </h1>
                    {/* <p
                        data-cy="ProductFullDetail-productPrice"
                        className={classes.productPrice}
                    >
                        <Price
                            currencyCode={productDetails.price.currency}
                            value={productDetails.price.value}
                        />
                    </p> */}
                    {shortDescription}
                </section>
                <article className={classes.priceContainer}> {priceRender}</article>
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
                        <article className={classes.totalPrice}>{tempTotalPrice}</article>
                    </article>
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
                <div className={classes.attachmentWrapper}>{productAttachments}</div>

                <section className={classes.details}>
                    <CustomAttributes customAttributes={customAttributesDetails.list} />
                </section>
                {pageBuilderAttributes}
            </Form>
        </Fragment>
    );
};

export default ProductFullDetailB2C;
