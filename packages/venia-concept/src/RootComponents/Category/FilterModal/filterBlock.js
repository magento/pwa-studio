import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import FilterList from './FilterList';
import Icon from 'src/components/Icon';
import ArrowDown from 'react-feather/dist/icons/chevron-down';
import ArrowUp from 'react-feather/dist/icons/chevron-up';
import defaultClasses from './filterBlock.css';

class FilterBlock extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        item: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            items: PropTypes.array,
            RenderOption: PropTypes.func
        }),
        chosenFilterOptions: PropTypes.object,
        updateChosenFilterOptions: PropTypes.func,
        isExpanded: PropTypes.bool
    };

    state = {
        isExpanded: false,
        chosenItemsFromUrl: {}
    };

    resetChosenItems = () => {
        this.updateChosenItems([]);
    };

    optionToggle = () => {
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
    };

    updateChosenItems = actualItems => {
        const { updateChosenFilterOptions } = this.props;
        updateChosenFilterOptions({
            optionName: this.props.item.request_var,
            optionItems: actualItems
        });
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

    render() {
        const {
            classes,
            item: { filter_items, request_var },
            filterRemove,
            filterAdd
        } = this.props;

        const { isExpanded } = this.state;

        return (
            <li className={classes.root}>
                {this.getControlBlock(isExpanded)}

                <div
                    className={
                        isExpanded
                            ? classes.filterListExpanded
                            : classes.filterList
                    }
                >
                    <FilterList
                        filterAdd={filterAdd}
                        filterRemove={filterRemove}
                        id={request_var}
                        items={filter_items}
                        updateChosenItems={this.updateChosenItems}
                    />
                </div>
            </li>
        );
    }
}

export default classify(defaultClasses)(FilterBlock);
