import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import FilterList from './FilterList';
import Icon from 'src/components/Icon';
import { filterModes, filterRenderOptions, filterLayouts } from './constants';
import ArrowDown from 'react-feather/dist/icons/chevron-down';
import ArrowUp from 'react-feather/dist/icons/chevron-up';
import defaultClasses from './filterBlock.css';

class FilterBlock extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            layout: PropTypes.string,
            layoutGrid: PropTypes.string,
            optionHeader: PropTypes.string,
            optionToggleButton: PropTypes.string,
            optionName: PropTypes.string,
            optionNameExpanded: PropTypes.string,
            closeWrapper: PropTypes.string,
            filterList: PropTypes.string,
            filterListExpanded: PropTypes.string
        }),
        item: PropTypes.shape({
            name: PropTypes.string,
            filter_items: PropTypes.array,
            request_var: PropTypes.string
        }),
        addFilter: PropTypes.func,
        removeFilter: PropTypes.func
    };

    state = {
        isExpanded: false
    };

    optionToggle = () => {
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
    };

    getControlBlock = isExpanded => {
        const { classes, item } = this.props;
        const iconSrc = isExpanded ? ArrowUp : ArrowDown;
        const nameClass = isExpanded
            ? classes.optionNameExpanded
            : classes.optionName;

        return (
            <div className={classes.optionHeader}>
                <button
                    onClick={this.optionToggle}
                    className={classes.optionToggleButton}
                >
                    <span className={nameClass}>{item.name}</span>
                    <span className={classes.closeWrapper}>
                        <Icon src={iconSrc} />
                    </span>
                </button>
            </div>
        );
    };

    getLayout = options => {
        const { layout } = options ? options : {};
        const { classes } = this.props;
        switch (layout) {
            case filterLayouts.grid:
                return classes.layoutGrid;
            default:
                return classes.layout;
        }
    };

    getRenderOptions = value =>
        filterRenderOptions[`${value}`] ||
        filterRenderOptions[filterModes.default];

    render() {
        const {
            classes,
            item: { filter_items, request_var, name },
            removeFilter,
            addFilter
        } = this.props;

        const { isExpanded } = this.state;

        const { mode, options } = this.getRenderOptions(request_var);

        const listClassName = isExpanded
            ? classes.filterListExpanded
            : classes.filterList;

        const controlBlock = this.getControlBlock(isExpanded);

        const filterLayoutClass = this.getLayout(options);

        const isSwatch = filterModes[mode] === filterModes.swatch;

        const filterProps = {
            isSwatch,
            options,
            name,
            addFilter,
            removeFilter,
            mode,
            id: request_var,
            items: filter_items,
            layoutClass: filterLayoutClass
        };

        return (
            <li className={classes.root}>
                {controlBlock}
                <div className={listClassName}>
                    <FilterList {...filterProps} />
                </div>
            </li>
        );
    }
}

export default classify(defaultClasses)(FilterBlock);
