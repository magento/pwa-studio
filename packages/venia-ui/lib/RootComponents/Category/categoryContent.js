import React, { Fragment, Suspense } from 'react';
import { array, number, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { mergeClasses } from '../../classify';
import Breadcrumbs from '../../components/Breadcrumbs';
import Button from '../../components/Button';
import Gallery from '../../components/Gallery';
import { Title } from '../../components/Head';
import Pagination from '../../components/Pagination';
import ProductSort from '../../components/ProductSort';
import RichContent from '../../components/RichContent';
import defaultClasses from './category.css';
import NoProductsFound from './NoProductsFound';

const FilterModal = React.lazy(() => import('../../components/FilterModal'));

const CategoryContent = props => {
    const { categoryId, data, pageControl, sortProps, pageSize } = props;
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
        handleLoadFilters,
        handleOpenFilters,
        items,
        pageTitle,
        totalPagesFromData
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const maybeFilterButtons = filters ? (
        <Button
            priority={'low'}
            classes={{ root_lowPriority: classes.filterButton }}
            onClick={handleOpenFilters}
            onFocus={handleLoadFilters}
            onMouseOver={handleLoadFilters}
            type="button"
        >
            <FormattedMessage
                id={'categoryContent.filter'}
                defaultMessage={'Filter'}
            />
        </Button>
    ) : null;

    const maybeSortButton =
        totalPagesFromData && filters ? (
            <ProductSort sortProps={sortProps} />
        ) : null;

    const maybeSortContainer =
        totalPagesFromData && filters ? (
            <div className={classes.sortContainer}>
                <FormattedMessage
                    id={'categoryContent.itemsSortedBy'}
                    defaultMessage={'Items sorted by '}
                />
                <span className={classes.sortText}>
                    <FormattedMessage
                        id={currentSort.sortId}
                        defaultMessage={currentSort.sortText}
                    />
                </span>
            </div>
        ) : null;

    // If you want to defer the loading of the FilterModal until user interaction
    // (hover, focus, click), simply add the talon's `loadFilters` prop as
    // part of the conditional here.
    const modal = filters ? <FilterModal filters={filters} /> : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const content = totalPagesFromData ? (
        <Fragment>
            <section className={classes.gallery}>
                <Gallery items={items} />
            </section>
            <div className={classes.pagination}>
                <Pagination pageControl={pageControl} />
            </div>
        </Fragment>
    ) : (
        <NoProductsFound categoryId={categoryId} />
    );

    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} />
            <Title>{pageTitle}</Title>
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.categoryTitle}>{categoryName}</div>
                </h1>
                {categoryDescriptionElement}
                <div className={classes.headerButtons}>
                    {maybeFilterButtons}
                    {maybeSortButton}
                </div>
                {maybeSortContainer}
                {content}
                <Suspense fallback={null}>{modal}</Suspense>
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
