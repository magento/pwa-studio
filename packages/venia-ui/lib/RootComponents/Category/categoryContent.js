import React, { Fragment, Suspense, useMemo } from 'react';
import { array, number, shape, string } from 'prop-types';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { mergeClasses } from '../../classify';
import Breadcrumbs from '../../components/Breadcrumbs';
import Gallery from '../../components/Gallery';
import { StoreTitle } from '../../components/Head';
import Pagination from '../../components/Pagination';
import ProductSort from '../../components/ProductSort';
import RichContent from '../../components/RichContent';
import defaultClasses from './category.css';
import NoProductsFound from './NoProductsFound';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import SortedByContainer from '../../components/SortedByContainer';
import FilterModalOpenButton from '../../components/FilterModalOpenButton';

const FilterModal = React.lazy(() => import('../../components/FilterModal'));

const CategoryContent = props => {
    const {
        categoryId,
        data,
        isLoading,
        pageControl,
        sortProps,
        pageSize
    } = props;
    const [currentSort] = sortProps;

    const talonProps = useCategoryContent({
        categoryId,
        data,
        pageSize
    });

    const {
        categoryName,
        categoryDescription,
        filters,
        items,
        totalPagesFromData
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const shouldShowButtons = !!(filters && filters.length);

    const maybeFilterButtons = shouldShowButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : null;

    const filtersModal = shouldShowButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const maybeSortButton =
        shouldShowButtons && totalPagesFromData ? (
            <ProductSort sortProps={sortProps} />
        ) : null;

    const maybeSortContainer =
        shouldShowButtons && totalPagesFromData ? (
            <SortedByContainer currentSort={currentSort} />
        ) : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const content = useMemo(() => {
        if (totalPagesFromData) {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <Gallery items={items} />
                    </section>
                    <div className={classes.pagination}>
                        <Pagination pageControl={pageControl} />
                    </div>
                </Fragment>
            );
        } else {
            if (isLoading) {
                return fullPageLoadingIndicator;
            } else {
                return <NoProductsFound categoryId={categoryId} />;
            }
        }
    }, [
        categoryId,
        classes.gallery,
        classes.pagination,
        isLoading,
        items,
        pageControl,
        totalPagesFromData
    ]);

    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} />
            <StoreTitle>{categoryName}</StoreTitle>
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.categoryTitle}>
                        {categoryName || '...'}
                    </div>
                </h1>
                {categoryDescriptionElement}
                <div className={classes.headerButtons}>
                    {maybeFilterButtons}
                    {maybeSortButton}
                </div>
                {maybeSortContainer}
                {content}
                <Suspense fallback={null}>{filtersModal}</Suspense>
            </article>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        filterContainer: string,
        sortContainer: string,
        gallery: string,
        headerButtons: string,
        filterButton: string,
        pagination: string,
        root: string,
        title: string
    }),
    // sortProps contains the following structure:
    // [{sortDirection: string, sortAttribute: string, sortText: string},
    // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
    sortProps: array,
    pageSize: number
};
