/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useMemo ,useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ItemsTable from './ItemsTable';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { Form } from 'informed';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './simpleProduct.module.css';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock/block';
import { useCmsBlock } from '@magento/peregrine/lib/hooks/useCmsBlocks';
import AvailableStore from '../../StoreLocator/AvailableStore';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertTriangle, Eye } from 'react-feather';

const OfflineIcon = <Icon src={AlertTriangle} attrs={{ width: 18 }} />;

const SimpleProductB2B = props => {
    const { cmsBlocks } = useCmsBlock({
        cmsBlockIdentifiers: ['warranties-block', 'recommended-product-block']
    });
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const [isOpenStoresModal, setIsOpenStoresModal] = useState(false);

    const warrantiesBlock = cmsBlocks.find(item => item.identifier === 'warranties-block')?.content;

    const recommendedProductBlock = cmsBlocks.find(item => item.identifier === 'recommended-product-block')?.content;

    const classes = useStyle(defaultClasses, props.classes);
    const {
        indexTable,
        errors,
        priceRender,
        wishlistButton,
        cartId,
        handleAddToCart,
        simpleProductData,
        simpleProductAggregation,
        tempTotalPrice,
        handleQuantityChange,
        isAddConfigurableLoading
    } = props;

    const [{ isSignedIn }] = useUserContext();

    const { mp_attachments } = simpleProductData;

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
        <main>
            <Breadcrumbs
                productSku={simpleProductData?.sku}
                categoryId={simpleProductData.categories[0].uid}
                currentProduct={simpleProductData.name}
            />
            <Form className={classes.root}>
                <section className={classes.imageCarouselContainer}>
                    <div className={classes.imageCarousel}>
                        <Carousel images={simpleProductData.media_gallery_entries} carouselWidth={960} />
                    </div>
                </section>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{simpleProductData.name}</h1>
                    {simpleProductData?.stock_status === 'IN_STOCK' && (
                        <article className={classes.innerPrice}>
                            <h2 className={classes.fromPrice}>
                                <FormattedMessage id={'productFullDetailB2B.fromPrice'} defaultMessage={'From '} />
                            </h2>

                            <span className={classes.priceNumber}>{priceRender}</span>
                        </article>
                    )}
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </h2>
                    <RichText content={simpleProductData.description.html} />
                {simpleProductData?.mp_pickup_locations?.length > 0 && (
                    <button onClick={() => setIsOpenStoresModal(true)} className={classes.storeButtion}>
                        <FormattedMessage
                            id={'storeLocator.SeeAvailablePickupStores'}
                            defaultMessage={'See available pickup stores'}
                        />
                    </button>
                )}
                </section>
                {productAttachments?.length > 0 &&
                <div className={classes.attachmentWrapper}>{productAttachments}</div>
                }
                <section className={classes.favoritesButton}>
                    {' '}
                    <Suspense fallback={null}>{wishlistButton}</Suspense>
                </section>
            </Form>

            <section>
                <CmsBlock content={warrantiesBlock} />
            </section>

            <div className={classes.productsTableContainer}>
                {indexTable}
                <ItemsTable
                    cartId={cartId}
                    errors={errors}
                    handleAddToCart={handleAddToCart}
                    simpleProductData={simpleProductData}
                    aggregations={simpleProductAggregation}
                    tempTotalPrice={tempTotalPrice}
                    handleQuantityChange={handleQuantityChange}
                    isAddConfigurableLoading={isAddConfigurableLoading}
                />
            </div>
            <section>
                <CmsBlock content={recommendedProductBlock} />
            </section>
            {isOpenStoresModal && (
                <AvailableStore
                    isOpen={isOpenStoresModal}
                    onCancel={() => setIsOpenStoresModal(false)}
                    storesList={simpleProductData?.mp_pickup_locations}
                />
            )}
        </main>
    );
};

export default SimpleProductB2B;
