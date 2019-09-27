import React, { Fragment, useCallback } from 'react';
import { shape, string } from 'prop-types';

import { Title } from '../../components/Head';
import { mergeClasses } from '../../classify';
import FilterModal from '../../components/FilterModal';
import Gallery from '../../components/Gallery';
import Pagination from '../../components/Pagination';
import defaultClasses from './category.css';
import { useAppContext } from '@magento/peregrine/lib/context/app';

// TODO: This can be replaced by the value from `storeConfig when the PR,
// https://github.com/magento/graphql-ce/pull/650, is released.
const pageSize = 6;
const placeholderItems = Array.from({ length: pageSize }).fill(null);

const CategoryContent = props => {
    const [, { toggleDrawer }] = useAppContext();

    const handleOpenFilters = useCallback(() => {
        toggleDrawer('filter');
    }, [toggleDrawer]);

    const { data, pageControl } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const filters = data ? data.products.filters : null;
    const items = data ? data.products.items : placeholderItems;
    const title = data ? data.category.name : null;
    const titleContent = title ? `${title} - Venia` : 'Venia';

    const header = filters ? (
        <div className={classes.headerButtons}>
            <button
                className={classes.filterButton}
                onClick={handleOpenFilters}
                type="button"
            >
                {'Filter'}
            </button>
        </div>
    ) : null;

    const modal = filters ? <FilterModal filters={filters} /> : null;
    return (
        <Fragment>
            <Title>{titleContent}</Title>
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.categoryTitle}>{title}</div>
                </h1>
                {header}
                <section className={classes.gallery}>
                    <Gallery items={items} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
                {modal}
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
