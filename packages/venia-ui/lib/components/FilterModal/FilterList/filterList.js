import React, { useCallback } from 'react';
import { compose } from 'redux';
import { array, bool, object, shape, string } from 'prop-types';
import { mergeClasses } from '../../../classify';
import { withRouter } from 'react-router-dom';
import defaultClasses from './filterList.css';
import { List } from '@magento/peregrine';
import FilterDefault from './filterDefault';
import Swatch from '../../ProductOptions/swatch';
import { WithFilterSearch } from '../../FilterModal/FilterSearch';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';

const stripHtml = html => html.replace(/(<([^>]+)>)/gi, '');

const FilterList = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { history, items, id, isSwatch, layoutClass } = props;
    const [
        { chosenFilterOptions },
        { removeFilter, addFilter }
    ] = useCatalogContext();

    const chosenOptions = chosenFilterOptions[id] || [];

    const isOptionActive = useCallback(
        option => {
            return (
                chosenOptions.findIndex(
                    item =>
                        item.value === option.value && item.name === option.name
                ) > -1
            );
        },
        [chosenOptions]
    );

    const toggleOption = useCallback(
        event => {
            const { value, title, dataset } =
                event.currentTarget || event.srcElement;
            const { group } = dataset;
            const item = { title, value, group };
            isOptionActive(item)
                ? removeFilter(item, history, window.location)
                : addFilter(item);
        },
        [addFilter, history, isOptionActive, removeFilter]
    );

    const isFilterSelected = useCallback(
        item => {
            const label = stripHtml(item.label);
            return !!chosenOptions.find(
                ({ title, value }) =>
                    label === title && item.value_string === value
            );
        },
        [chosenOptions]
    );

    return (
        <List
            items={items}
            getItemKey={({ value_string }) => `item-${id}-${value_string}`}
            render={props => <ul className={layoutClass}>{props.children}</ul>}
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
};

FilterList.propTypes = {
    classes: shape({
        filterItem: string
    }),
    history: object,
    items: array,
    id: string,
    layoutClass: string,
    isSwatch: bool
};

export default compose(
    withRouter,
    WithFilterSearch
)(FilterList);
