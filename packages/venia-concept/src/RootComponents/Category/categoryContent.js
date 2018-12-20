import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import globalClasses from 'src/index.css';
import FilterModal from './FilterModal';
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

    state = {
        filterModalOpen: false
    };

    get filterModal() {
        return this.state.filterModalOpen ? (
            <FilterModal closeModalHandler={this.filterModalSwitcher} />
        ) : null;
    }

    filterModalSwitcher = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;

        bodyClasses.contains(modalIsOpen)
            ? bodyClasses.remove(modalIsOpen)
            : bodyClasses.add(modalIsOpen);
        this.setState({ filterModalOpen: !this.state.filterModalOpen });
    };

    render() {
        const { classes, pageControl, data, pageSize } = this.props;
        const items = data ? data.category.products.items : null;
        const title = data ? data.category.description : null;

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    />
                    <div className={classes.headerButtons}>
                        <button
                            onClick={this.filterModalSwitcher}
                            className={classes.filterButton}
                        >
                            Filter
                        </button>
                    </div>
                </h1>
                <section className={classes.gallery}>
                    <Gallery data={items} title={title} pageSize={pageSize} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
                {this.filterModal}
            </article>
        );
    }
}

export default classify(defaultClasses)(CategoryContent);
