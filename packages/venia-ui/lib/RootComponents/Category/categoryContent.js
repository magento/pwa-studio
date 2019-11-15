import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';

import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { mergeClasses } from '../../classify';
import { Title } from '../../components/Head';
import Breadcrumbs from '../../components/Breadcrumbs';
import Gallery from '../../components/Gallery';
import Pagination from '../../components/Pagination';
import defaultClasses from './category.css';

const FilterModal = React.lazy(() => import('../../components/FilterModal'));

const CategoryContent = props => {
    const { data, pageControl } = props;

    const talonProps = useCategoryContent({ data });

    const {
        categoryId,
        categoryName,
        filters,
        handleLoadFilters,
        handleOpenFilters,
        items,
        loadFilters,
        pageTitle
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
        </div>
    ) : null;

    const modal =
        filters && loadFilters ? <FilterModal filters={filters} /> : null;

    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} />
            <Title>{pageTitle}</Title>
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.categoryTitle}>{categoryName}</div>
                </h1>
                {header}
                <section className={classes.gallery}>
                    <Gallery items={items} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
                <Suspense fallback={null}>{modal}</Suspense>
            </article>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        filterContainer: string,
        gallery: string,
        headerButtons: string,
        pagination: string,
        root: string,
        title: string
    })
};
