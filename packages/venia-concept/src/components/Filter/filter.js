import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './filter.css';

class Filter extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            filterIconContainer: PropTypes.string
        }),
        innerText: PropTypes.string,
        onClickHandler: PropTypes.func
    };

    static defaultProps = {
        iconName: 'filter',
        innerText: 'Filter by...'
    };

    render() {
        const { classes, onClickHandler, innerText } = this.props;

        return (
            <button
                className={classes.root}
                aria-label="filter"
                onClick={onClickHandler}
            >
                <div className={classes.filterIconContainer}>Filter icon</div>
                <span>{innerText}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Filter);
