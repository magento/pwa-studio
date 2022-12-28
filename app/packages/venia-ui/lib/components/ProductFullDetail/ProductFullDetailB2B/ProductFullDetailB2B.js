/* eslint-disable react/jsx-no-literals */
import React, { Fragment, useState, Suspense, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'informed';
import { useStyle } from '@magento/venia-ui/lib/classify';

import RichText from '../../RichText';
import Carousel from '../../ProductImageCarousel';
import CurrentFilter from '../../FilterModal/CurrentFilters/currentFilter';
import ProductItem from './ProductItem/ProductItem';
import CategoryFilter from './CategoryFilter/CategoryFilter';
import defaultClasses from './ProductFullDetailB2B.module.css';
import CmsBlock from '../../CmsBlock/block';
import { useCmsBlock } from '@magento/peregrine/lib/hooks/useCmsBlocks';

const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));

import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import Breadcrumbs from '../../Breadcrumbs';
import Pagination from '../../Pagination';

const ProductFullDetailB2B = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { cmsBlocks } = useCmsBlock({
        cmsBlockIdentifiers: ['warranties-block', 'recommended-product-block']
    });

    const warrantiesBlock = cmsBlocks.find(item => item.identifier === 'warranties-block')?.content;

    const recommendedProductBlock = cmsBlocks.find(item => item.identifier === 'recommended-product-block')?.content;

    const {
        addConfigurableProductToCart,
        availableOptions,
        cartId,
        errors,
        isAddConfigurableLoading,
        mediaGalleryEntries,
        priceRender,
        product,
        productDetails,
        wishlistButtonProps
    } = props;
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [selectedFilterCategory, setSelectedFilterCategory] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const getCategoriesValuesIdByVariant = variant => {
        return variant.attributes.map(attribute => {
            return attribute.value_index;
        });
    };

    const selectedVariants = variants => {
        const items = [];
        variants.map(variant => {
            const categoriesIds = getCategoriesValuesIdByVariant(variant);
            let isContained;
            if (selectedFilterCategory?.length) {
                isContained = selectedFilterCategory?.map(filterArr =>
                    categoriesIds?.some(id => (filterArr?.length ? filterArr?.map(ele => ele.id).includes(id) : id))
                );
            }
            if (selectedFilterCategory?.length === 0 || isContained.every(e => e === true)) {
                return items.push(variant);
            } else {
                return null;
            }
        });

        return items;
    };

    const totalPage = useMemo(() => Math.ceil(selectedVariants(product.variants)?.length / 10) || 2, [
        product,
        selectedVariants
    ]);

    const paginateItems = useMemo(() => {
        const { variants } = product;
        const items = selectedVariants(variants);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;
        if (currentPage > totalPage) setCurrentPage(totalPage);
        return items?.slice(startIndex, endIndex);
    }, [product, selectedVariants, currentPage, pageSize, totalPage]);
    const pageControl = {
        currentPage: currentPage,
        setPage: val => setCurrentPage(val),
        totalPages: totalPage
    };
    const getCategoriesValuesNameByVariant = variant => {
        return variant.attributes.map((attribute, i) => {
            return product.configurable_options[i].values.find(value => value.value_index == attribute.value_index)
                .label;
        });
    };
    const [getFilters, { data: filterData }] = useLazyQuery(GET_CATEGORY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        if (product.categories) {
            const categoryId = product.categories[0].uid;
            getFilters({
                variables: {
                    categoryIdFilter: {
                        eq: categoryId
                    }
                }
            });
        }
    }, [product, getFilters]);

    const getCategoriesName = () => {
        return product.configurable_options.map(category => {
            return category.label;
        });
    };

    const fillFilters = () => {
        const filters = [];
        product.configurable_options.map(category =>
            filters.push(
                category.values.map(value => {
                    return { id: value.value_index, text: value.label };
                })
            )
        );

        const categoriesName = getCategoriesName();
        filters.map((filter, i) => {
            filter.unshift(categoriesName[i]);
        });
        return filters;
    };

    const handleRemoveItem = (tempItemInfo, index) => {
        const newSelectedFilter = [...selectedFilterCategory];
        newSelectedFilter[index] = newSelectedFilter[index].filter(({ id }) => id !== tempItemInfo.item.value);
        setSelectedFilterCategory(newSelectedFilter);
        let tempFilterList = selectedFilter;
        tempFilterList = tempFilterList.filter(filter => filter.id != tempItemInfo.item.value);
        setSelectedFilter(tempFilterList);
    };

    const selectedFilterList = (
        <div className={classes.selectedFilterContainer}>
            <div className={classes.selectedFilter}>
                {selectedFilterCategory?.map((filterCat, index) => (
                    <>
                        {filterCat?.map(fil => (
                            <CurrentFilter
                                item={{ title: fil.text, value: fil.id }}
                                removeItem={tempItemInfo => handleRemoveItem(tempItemInfo, index)}
                            />
                        ))}
                    </>
                ))}
            </div>
        </div>
    );

    const selectFilterClick = (filterList, index, filter) => {
        const newSelected = [...selectedFilterCategory];
        newSelected[index] = newSelected[index] || [];
        const keys = filter.map(filter => filter.id);
        newSelected[index] = [...filterList.filter(({ id }) => keys.includes(id))];
        setSelectedFilterCategory(newSelected);
        setSelectedFilter(filterList);
    };
    const filterOptions = (
        <div className={classes.filterNameSelectorContainer}>
            {fillFilters().map((filter, index) => {
                const filterName = filter.shift();
                return (
                    <div className={classes.filterNameSelector}>
                        <CategoryFilter
                            filterName={filterName}
                            availableCategoryItems={filter}
                            selectedFilter={selectedFilter}
                            setSelectedFilter={e => selectFilterClick(e, index, filter)}
                        />
                    </div>
                );
            })}
        </div>
    );

    const indexTable = (
        <div className={classes.productItemContainer}>
            <p key="imageIndex" className={classes.indexFixed} />
            <p key="nameIndex" className={classes.indexMobileName}>
                <FormattedMessage id={'productFullDetailB2B.indexName'} defaultMessage={'Name'} />
            </p>
            <p key="skuIndex" className={classes.indexMobileSku}>
                SKU
            </p>
            <div className={classes.categoriesItemList}>
                {getCategoriesName().map(category => {
                    return <p className={classes.indexFixedCategory}>{category}</p>;
                })}
            </div>
            <p key="quantityIndex" className={classes.indexFixed}>
                <FormattedMessage id={'productFullDetailB2B.indexQuantity'} defaultMessage={'Quantity'} />
            </p>
            <p className={classes.titles} key="priceIndex">
                <FormattedMessage id={'productFullDetailB2B.indexUnitPrice'} defaultMessage={'Price / Unit'} />
            </p>
            <p className={classes.titles} key="totalPriceIndex">
                <FormattedMessage id={'productFullDetailB2B.totalPrice'} defaultMessage={'Total Price'} />
            </p>
        </div>
    );

    const productsTable = (
        <div className={classes.productsTableContainer}>
            {paginateItems?.map(variant => {
                const categoriesValuesName = getCategoriesValuesNameByVariant(variant);
                const categoriesName = getCategoriesName();
                return (
                    <ProductItem
                        product={product}
                        variant={variant}
                        categoriesValuesName={categoriesValuesName}
                        categoriesName={categoriesName}
                        addConfigurableProductToCart={addConfigurableProductToCart}
                        cartId={cartId}
                        errors={errors}
                        isAddConfigurableLoading={isAddConfigurableLoading}
                    />
                );
            })}
        </div>
    );

    return (
        <Fragment key={productDetails.sku}>
            <Breadcrumbs
                categoryId={product.categories[0].uid}
                currentProduct={product.name}
                url_keys={filterData?.products}
            />
            <Form className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{productDetails.name}</h1>
                    <article className={classes.innerPrice}>
                        <h2 className={classes.fromPrice}>
                            <FormattedMessage id={'productFullDetailB2B.fromPrice'} defaultMessage={'From '} />
                        </h2>

                        <span className={classes.priceNumber}>{priceRender}</span>
                    </article>
                </section>
                <section className={classes.imageCarouselContainer}>
                    <div className={classes.imageCarousel}>
                        <Carousel images={mediaGalleryEntries} carouselWidth={960} />
                    </div>
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
                <section className={classes.favoritesButton}>
                    <Suspense fallback={null}>
                        <WishlistButton {...wishlistButtonProps} />
                    </Suspense>
                </section>

                <section className={classes.b2cContent}>
                    <section>
                        <CmsBlock content={warrantiesBlock} />
                    </section>

                    <div className={classes.productsContainer}>
                        {selectedFilterList}
                        {filterOptions}
                        {indexTable}
                        {productsTable}
                        <Pagination
                            classes={{ root: classes.paginationB2B }}
                            class="productsTable"
                            pageControl={pageControl}
                        />
                    </div>
                    <section className={classes.recommendedProdut}>
                        <CmsBlock content={recommendedProductBlock} />
                    </section>
                </section>
                <section className={classes.hide}>{availableOptions}</section>
            </Form>
        </Fragment>
    );
};

export default ProductFullDetailB2B;

export const GET_CATEGORY = gql`
    query getProductFiltersByCategory($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_uid: $categoryIdFilter }, pageSize: 50) {
            items {
                id
                uid
                __typename
                name
                url_key
                url_suffix
            }
        }
    }
`;
