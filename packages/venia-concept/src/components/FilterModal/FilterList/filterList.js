import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import { withRouter } from 'react-router-dom';
import defaultClasses from './filterList.css';
import { List } from '@magento/peregrine';
import FilterDefault from './filterDefault';
import Swatch from 'src/components/ProductOptions/swatch';
import { WithFilterSearch } from 'src/components/FilterModal/FilterSearch';

class FilterList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            filterItem: PropTypes.string
        }),
        chosenOptions: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                value: PropTypes.string
            })
        ),
        layoutClass: PropTypes.string,
        isSwatch: PropTypes.bool,
        addFilter: PropTypes.func,
        removeFilter: PropTypes.func,
        items: PropTypes.array
    };

    stripHtml = html => html.replace(/(<([^>]+)>)/gi, '');

    toggleOption = event => {
        const { removeFilter, addFilter, history } = this.props;
        const { value, title, dataset } =
            event.currentTarget || event.srcElement;
        const { group } = dataset;
        const item = { title, value, group };
        this.isOptionActive(item)
            ? removeFilter(item, history, window.location)
            : addFilter(item);
    };

    isOptionActive = option =>
        this.props.chosenOptions.findIndex(
            item => item.value === option.value && item.name === option.name
        ) > -1;

    isFilterSelected = item => {
        const label = this.stripHtml(item.label);
        return !!this.props.chosenOptions.find(
            ({ title, value }) => label === title && item.value_string === value
        );
    };

    render() {
        const { toggleOption, isFilterSelected, stripHtml } = this;
        const { classes, items, id, layoutClass, isSwatch } = this.props;

        return (
            <List
                items={items}
                getItemKey={({ value_string }) => `item-${id}-${value_string}`}
                render={props => (
                    <ul className={layoutClass}>{props.children}</ul>
                )}
                renderItem={({ item }) => {
                    const isActive = isFilterSelected(item);

                    const filterProps = {
                        item: {
                            label: stripHtml(item.label),
                            value_index: item.value_string
                        },
                        value: item.value_string,
                        title: stripHtml(item.label),
                        'data-group': id,
                        onClick: toggleOption,
                        isSelected: isActive
                    };

                    const filterClass = !isSwatch ? classes.filterItem : null;

                    return (
                        <li className={filterClass}>
                            {isSwatch ? (
                                <Swatch {...filterProps} />
                            ) : (
                                <FilterDefault {...filterProps} />
                            )}
                        </li>
                    );
                }}
            />
        );
    }
}

const mapStateToProps = ({ catalog }, { id }) => {
    const { chosenFilterOptions } = catalog;

    return {
        chosenOptions: chosenFilterOptions[id] || []
    };
};

export default compose(
    withRouter,
    classify(defaultClasses),
    connect(mapStateToProps),
    WithFilterSearch
)(FilterList);
