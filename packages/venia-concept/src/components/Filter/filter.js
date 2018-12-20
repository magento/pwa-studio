import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './filter.css';

const FILTER_ICON_ATTRS = {
    width: 16,
    color: 'rgb(0, 134, 138)'
};

class Filter extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            filterIconContainer: PropTypes.string
        }),
        iconName: PropTypes.string,
        innerText: PropTypes.string,
        onClickHandler: PropTypes.func
    };

    static defaultProps = {
        iconName: 'filter',
        innerText: 'Filter by...'
    };

    render() {
        const { classes, onClickHandler, iconName, innerText } = this.props;

        return (
            <button
                className={classes.root}
                aria-label="filter"
                onClick={onClickHandler}
            >
                <div className={classes.filterIconContainer}>
                    <Icon name={iconName} attrs={FILTER_ICON_ATTRS} />
                </div>
                <span>{innerText}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Filter);
