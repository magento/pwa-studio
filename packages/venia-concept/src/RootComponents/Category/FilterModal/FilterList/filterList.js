import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import Checkmark from 'react-feather/dist/icons/check';
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

    static getDerivedStateFromProps(nextProps, prevState) {
        const updatedChosenOptions = nextProps.chosenOptions;
        return prevState.chosenOptions !== updatedChosenOptions
            ? { chosenOptions: updatedChosenOptions }
            : null;
    }

    state = {
        chosenOptions: []
    };

    addOption = item => {
        const { updateChosenItems } = this.props;
        updateChosenItems(this.state.chosenOptions.concat([item]));
    };

    removeOption = option => {
        const { updateChosenItems } = this.props;
        const { chosenOptions } = this.state;
        const filteredOptions = chosenOptions.filter(
            currentOption =>
                currentOption.title !== option.title &&
                currentOption.value !== option.value
        );
        updateChosenItems(filteredOptions);
    };

    toggleOption = event => {
        const { value, title } = event.currentTarget || event.srcElement;
        this.isOptionActive({ title, value })
            ? this.removeOption({ title, value })
            : this.addOption({ title, value });
    };

    isOptionActive = option =>
        this.state.chosenOptions.findIndex(
            item => item.value === option.value && item.name === option.name
        ) > -1;

    getFilterIcon = value => {
        const { classes } = this.props;
        return (
            this.isOptionActive(value) && (
                <Icon
                    className={classes.icon}
                    attrs={{ color: 'white' }}
                    src={Checkmark}
                    size={28}
                />
            )
        );
    };

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

    render() {
        const { toggleOption, getFilterIcon } = this;
        const { classes, items, id } = this.props;

        const { mode, options } = this.getRenderOptions(id);

        const filterLayoutClass = this.getLayout(options);

        const isSwatch = filterModes[mode] === filterModes.swatch;

        return (
            <List
                items={items}
                getItemKey={({ value_string }) => `${id}-${value_string}`}
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
                                isActive={this.isOptionActive({
                                    title: item.label,
                                    value: item.value_string
                                })}
                                toggleOption={toggleOption}
                                icon={getFilterIcon({
                                    title: item.label,
                                    value: item.value_string
                                })}
                            />
                        ) : (
                            <FilterDefault
                                {...item}
                                group={id}
                                isActive={this.isOptionActive({
                                    title: item.label,
                                    value: item.value_string
                                })}
                                toggleOption={toggleOption}
                                icon={getFilterIcon({
                                    title: item.label,
                                    value: item.value_string
                                })}
                            />
                        )}
                    </li>
                )}
            />
        );
    }
}

export default classify(defaultClasses)(FilterList);
