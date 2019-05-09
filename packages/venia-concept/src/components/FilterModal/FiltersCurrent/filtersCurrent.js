import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Icon from 'src/components/Icon';
import Remove from 'react-feather/dist/icons/x';
import classify from 'src/classify';
import { withRouter } from 'react-router-dom';
import defaultClasses from './filtersCurrent.css';

class FiltersCurrent extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            item: PropTypes.string,
            button: PropTypes.string,
            icon: PropTypes.string
        }),
        keyPrefix: PropTypes.string,
        removeFilter: PropTypes.func,
        chosenFilterOptions: PropTypes.shape({
            title: PropTypes.string,
            value: PropTypes.string
        })
    };

    removeOption = event => {
        const { title, value, dataset } =
            event.currentTarget || event.srcElement;
        const { group } = dataset;
        const { removeFilter, history, location } = this.props;
        removeFilter({ title, value, group }, history, location);
    };

    getCurrentFilter = (item, key) => {
        const { removeOption } = this;
        const { classes, keyPrefix } = this.props;
        const { title, value } = item;

        return (
            <li className={classes.item} key={`${keyPrefix}-${title}-${value}`}>
                <button
                    className={classes.button}
                    onClick={removeOption}
                    data-group={key}
                    title={title}
                    value={value}
                >
                    <Icon className={classes.icon} src={Remove} size={16} />
                    <span>{title}</span>
                </button>
            </li>
        );
    };

    render() {
        const { chosenFilterOptions, classes } = this.props;
        const { getCurrentFilter } = this;

        return (
            <ul className={classes.root}>
                {Object.keys(chosenFilterOptions).map(key =>
                    chosenFilterOptions[key].map(item =>
                        getCurrentFilter(item, key)
                    )
                )}
            </ul>
        );
    }
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(FiltersCurrent);
