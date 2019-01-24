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
        classes: PropTypes.shape({}),
        updateChosenItems: PropTypes.func
    };

    addOption = item => {
        const { filterAdd } = this.props;
        filterAdd(item);
        console.log('FILTER ADD', item);
    };

    removeOption = item => {
        const { filterRemove } = this.props;
        filterRemove(item);
    };

    toggleOption = event => {
        const { value, title, dataset } =
            event.currentTarget || event.srcElement;
        const { group } = dataset;
        this.isOptionActive({ title, value, group })
            ? this.removeOption({ title, value, group })
            : this.addOption({ title, value, group });
    };

    isOptionActive = option =>
        this.props.chosenOptions.findIndex(
            item => item.value === option.value && item.name === option.name
        ) > -1;

    getLayout = options => {
        const { layout } = options || '';
        const { classes } = this.props;
        switch (layout) {
            case filterLayouts.grid:
                return classes.rootGrid;
                break;
            default:
                return classes.root;
        }
    };

    getRenderOptions = value =>
        filterRenderOptions[`${value}`] ||
        filterRenderOptions[filterModes.default];

    shouldComponentUpdate = ({ chosenOptions }) => {
        return false;
    };

    render() {
        const { toggleOption } = this;
        const { classes, items, id } = this.props;

        const { mode, options } = this.getRenderOptions(id);

        const filterLayoutClass = this.getLayout(options);

        const isSwatch = filterModes[mode] === filterModes.swatch;

        console.log('ID', id);

        return (
            <List
                items={items}
                getItemKey={({ value_string }) => `item-${id}-${value_string}`}
                render={props => (
                    <ul className={filterLayoutClass}>{props.children}</ul>
                )}
                renderItem={({ item }) => (
                    <li className={classes.filterItem}>
                        {isSwatch ? (
                            <FilterSwatch
                                {...item}
                                group={id}
                                options={options}
                                toggleOption={toggleOption}
                            />
                        ) : (
                            <FilterDefault
                                {...item}
                                group={id}
                                toggleOption={toggleOption}
                            />
                        )}
                    </li>
                )}
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
