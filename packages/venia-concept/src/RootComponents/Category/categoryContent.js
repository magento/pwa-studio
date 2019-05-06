import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import FilterModal from 'src/components/FilterModal';
import defaultClasses from './category.css';

class CategoryContent extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            title: PropTypes.string,
            headerButtons: PropTypes.string,
            filterContainer: PropTypes.string,
            gallery: PropTypes.string,
            pagination: PropTypes.string,
            filterContainer: PropTypes.string
        })
    };

    render() {
        const { classes, pageControl, data, pageSize, openDrawer } = this.props;

        const items = data ? data.products.items : null;
        const filters = data ? data.products.filters : null;
        const title = data ? data.category.description : null;
        const categoryTitle = data ? data.category.name : null;

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    />
                    <div className={classes.categoryTitle}>{categoryTitle}</div>
                </h1>
                {filters && (
                    <div className={classes.headerButtons}>
                        <button
                            onClick={openDrawer}
                            className={classes.filterButton}
                        >
                            Filter
                        </button>
                    </div>
                )}
                <section className={classes.gallery}>
                    <Gallery data={items} title={title} pageSize={pageSize} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
                {filters && <FilterModal filters={filters} />}
            </article>
        );
    }
}

export default classify(defaultClasses)(CategoryContent);
