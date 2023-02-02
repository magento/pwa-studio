import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import ItemsTable from './ItemsTable';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { Form } from 'informed';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './simpleProduct.module.css';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock/block';
import { useCmsBlock } from '@magento/peregrine/lib/hooks/useCmsBlocks';

const SimpleProductB2B = props => {
    const { cmsBlocks } = useCmsBlock({
        cmsBlockIdentifiers: ['warranties-block', 'recommended-product-block']
    });

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
        handleQuantityChange
    } = props;

    return (
        <main>
            <Breadcrumbs categoryId={simpleProductData.categories[0].uid} currentProduct={simpleProductData.name} />
            <Form className={classes.root}>
                <section className={classes.imageCarouselContainer}>
                    <div className={classes.imageCarousel}>
                        <Carousel images={simpleProductData.media_gallery_entries} carouselWidth={960} />
                    </div>
                </section>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{simpleProductData.name}</h1>
                    <article className={classes.innerPrice}>
                        <h2 className={classes.fromPrice}>
                            <FormattedMessage id={'productFullDetailB2B.fromPrice'} defaultMessage={'From '} />
                        </h2>

                        <span className={classes.priceNumber}>{priceRender}</span>
                    </article>
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </h2>
                    <RichText content={simpleProductData.description.html} />
                </section>
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
                />
            </div>
            <section>
                <CmsBlock content={recommendedProductBlock} />
            </section>
        </main>
    );
};

export default SimpleProductB2B;
