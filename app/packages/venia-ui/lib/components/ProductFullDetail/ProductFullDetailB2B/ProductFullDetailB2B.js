/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-literals */
import React, { Fragment, useState, Suspense, useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
import { useUserContext } from '@magento/peregrine/lib/context/user';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertTriangle, Eye } from 'react-feather';
import { useToasts } from '@magento/peregrine';

const previewIcon = <Icon src={Eye} size={20} />;
const OfflineIcon = <Icon src={AlertTriangle} attrs={{ width: 18 }} />;

import CATEGORY_OPERATIONS from '@magento/peregrine/lib/talons/RootComponents/Category/categoryContent.gql.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import AvailableStore from '../../StoreLocator/AvailableStore';
import { useLazyQuery } from '@apollo/client';
import Breadcrumbs from '../../Breadcrumbs';
import Pagination from '../../Pagination';

const ProductFullDetailB2B = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const operations = mergeOperations(CATEGORY_OPERATIONS, props.operations);
    const { getProductItemsFilteredByCategoryQuery } = operations;

    const { cmsBlocks } = useCmsBlock({
        cmsBlockIdentifiers: ['warranties-block', 'recommended-product-block']
    });

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

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
    const [isOpenStoresModal, setIsOpenStoresModal] = useState(false);

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

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const getCategoriesValuesIdByVariant = variant => {
        return variant.attributes.map(attribute => {
            return attribute.value_index;
        });
    };

    const productAttachments = useMemo(
        () =>
            mp_attachments?.map(att => (
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
            )),
        [mp_attachments, isSignedIn]
    );

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

    const [getFilters, { data: filterData }] = useLazyQuery(getProductItemsFilteredByCategoryQuery, {
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
                productSku={product.sku}
                currentProduct={product.name}
                url_keys={filterData?.products}
            />
            <Form className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{productDetails.name}</h1>
                    {product?.stock_status === 'IN_STOCK' && (
                        <>
                            <article className={classes.innerPrice}>
                                <h2 className={classes.fromPrice}>
                                    <FormattedMessage id={'productFullDetailB2B.fromPrice'} defaultMessage={'From '} />
                                </h2>
                                <span className={classes.priceNumber}>{priceRender}</span>
                            </article>
                            {product?.mp_pickup_locations?.length > 0 && (
                                <button onClick={() => setIsOpenStoresModal(true)} className={classes.storeButtion}>
                                    <FormattedMessage
                                        id={'storeLocator.SeeAvailablePickupStores'}
                                        defaultMessage={'See available pickup stores'}
                                    />
                                </button>
                            )}
                        </>
                    )}
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
                {productAttachments?.length > 0 && (
                    <section className={classes.attachmentWrapper}>{productAttachments}</section>
                )}
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

            {isOpenStoresModal && (
                <AvailableStore
                    isOpen={isOpenStoresModal}
                    onCancel={() => setIsOpenStoresModal(false)}
                    storesList={product?.mp_pickup_locations}
                />
            )}
        </Fragment>
    );
};

export default ProductFullDetailB2B;
