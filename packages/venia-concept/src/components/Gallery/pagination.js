import React, { Component } from 'react';
import classify from 'src/classify';
import defaultClasses from './pagination.css';

class Pagination extends Component {
    get navigationTiles() {
        const { classes, pageControl } = this.props;
        const { currentPage, totalPages } = pageControl;
        const pages = [];
        for (var i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages.map(page => (
            <button
                className={page == currentPage ? classes.selected : ''}
                key={page}
                onClick={() => this.setPage(page)}
            >
                {page}
            </button>
        ));
    }

    render() {
        const { classes } = this.props;

        return <div className={classes.pageNav}>{this.navigationTiles}</div>;
    }

    setPage = pageNumber => {
        this.props.pageControl.setPage(pageNumber);
    };
}

export default classify(defaultClasses)(Pagination);
