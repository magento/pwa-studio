import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import FilterModal from 'src/components/FilterModal';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import defaultClasses from './category.css';

const CategoryContent = props => {
    const { data, openDrawer, pageControl, pageSize } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const filters = data ? data.products.filters : null;
    const items = data ? data.products.items : null;
    const title = data ? data.category.name : null;

    const header = filters ? (
        <div className={classes.headerButtons}>
            <button
                className={classes.filterButton}
                onClick={openDrawer}
                type="button"
            >
                {'Filter'}
            </button>
        </div>
    ) : null;

    const modal = filters ? <FilterModal filters={filters} /> : null;

    return (
        <article className={classes.root}>
            <h1 className={classes.title}>
                <div className={classes.categoryTitle}>{title}</div>
            </h1>
            {header}
            <section className={classes.gallery}>
                <Gallery data={items} pageSize={pageSize} />
            </section>
            <div className={classes.pagination}>
                <Pagination pageControl={pageControl} />
            </div>
            {modal}
        </article>
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
