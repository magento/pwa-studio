import React, { Fragment, Suspense } from 'react';
import { func, shape, string } from 'prop-types';

import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import NoProductsFound from './NoProductsFound';
import { mergeClasses } from '../../classify';
import { Title } from '../../components/Head';
import Breadcrumbs from '../../components/Breadcrumbs';
import Gallery from '../../components/Gallery';
import CategorySort from '../../components/CategorySort';
import Pagination from '../../components/Pagination';
import defaultClasses from './category.css';

const FilterModal = React.lazy(() => import('../../components/FilterModal'));
import GET_PRODUCT_FILTERS_BY_CATEGORY from '../../queries/getProductFiltersByCategory.graphql';

const CategoryContent = props => {
    const { categoryId, data, pageControl, sortControl } = props;

    const talonProps = useCategoryContent({
        categoryId,
        data,
        queries: {
            getProductFiltersByCategory: GET_PRODUCT_FILTERS_BY_CATEGORY
        }
    });

    const {
        categoryName,
        filters,
        handleLoadFilters,
        handleOpenFilters,
        items,
        pageTitle,
        totalPagesFromData
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const header = filters ? (
        <div className={classes.headerButtons}>
            <button
                className={classes.filterButton}
                onClick={handleOpenFilters}
                onFocus={handleLoadFilters}
                onMouseOver={handleLoadFilters}
                type="button"
            >
                {'Filter'}
            </button>
            <CategorySort sortControl={sortControl} />
        </div>
    ) : null;

    // If you want to defer the loading of the FilterModal until user interaction
    // (hover, focus, click), simply add the talon's `loadFilters` prop as
    // part of the conditional here.
    const modal = filters ? <FilterModal filters={filters} /> : null;

    const content =
        totalPagesFromData === 0 ? (
            <NoProductsFound categoryId={categoryId} />
        ) : (
            <Fragment>
                <section className={classes.gallery}>
                    <Gallery items={items} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
            </Fragment>
        );
    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} />
            <Title>{pageTitle}</Title>
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.categoryTitle}>{categoryName}</div>
                </h1>
                {header}
                {content}
                <Suspense fallback={null}>{modal}</Suspense>
            </article>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    sortControl: shape({
        currentSort: shape({
            setSortDirection: string,
            sortAttribute: string
        }),
        setSort: func.isRequired
    }),
    classes: shape({
        filterContainer: string,
        gallery: string,
        headerButtons: string,
        pagination: string,
        root: string,
        title: string
    })
};
