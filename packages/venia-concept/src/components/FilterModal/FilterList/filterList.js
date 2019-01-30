import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './filterList.css';
import { List } from '@magento/peregrine';
import { filterModes, filterRenderOptions, filterLayouts } from './constants';
import FilterDefault from './filterDefault';
import FilterSwatch from './FilterSwatch';

class FilterList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            rootGrid: PropTypes.string,
            filterItem: PropTypes.string
        }),
        chosenOptions: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                value: PropTypes.string
            })
        ),
        filterAdd: PropTypes.func,
        filterRemove: PropTypes.func,
        items: PropTypes.array
    };

    toggleOption = event => {
        const { filterRemove, filterAdd } = this.props;
        const { value, title, dataset } =
            event.currentTarget || event.srcElement;
        const { group } = dataset;
        const item = { title, value, group };
        this.isOptionActive(item) ? filterRemove(item) : filterAdd(item);
    };

    isOptionActive = option =>
        this.props.chosenOptions.findIndex(
            item => item.value === option.value && item.name === option.name
        ) > -1;

    getLayout = options => {
        const { layout } = options ? options : {};
        const { classes } = this.props;
        switch (layout) {
            case filterLayouts.grid:
                return classes.rootGrid;
            default:
                return classes.root;
        }
    };

    getRenderOptions = value =>
        filterRenderOptions[`${value}`] ||
        filterRenderOptions[filterModes.default];

    isFilterSelected = item => {
        return !!this.props.chosenOptions.find(
            ({ title, value }) =>
                item.label === title && item.value_string === value
        );
    };

    render() {
        const {
            toggleOption,
            getRenderOptions,
            getLayout,
            isFilterSelected
        } = this;
        const { classes, items, id } = this.props;

        const { mode, options } = getRenderOptions(id);
        const filterLayoutClass = getLayout(options);

        const isSwatch = filterModes[mode] === filterModes.swatch;

        return (
            <List
                items={items}
                getItemKey={({ value_string }) => `item-${id}-${value_string}`}
                render={props => (
                    <ul className={filterLayoutClass}>{props.children}</ul>
                )}
                renderItem={({ item }) => {
                    const isActive = isFilterSelected(item);
                    const swatchProps = {
                        ...item,
                        isActive,
                        options,
                        toggleOption,
                        group: id
                    };

                    return (
                        <li className={classes.filterItem}>
                            {isSwatch ? (
                                <FilterSwatch {...swatchProps} />
                            ) : (
                                <FilterDefault {...swatchProps} />
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
    classify(defaultClasses),
    connect(mapStateToProps)
)(FilterList);
