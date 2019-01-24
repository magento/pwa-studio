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
        isExpanded: false
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

    render() {
        const {
            classes,
            item: { name, filter_items, request_var },
            chosenFilterOptions,
            filterRemove,
            filterAdd
        } = this.props;

        const { isExpanded } = this.state;

        return (
            <div className={classes.root}>
                <div className={classes.optionHeader}>
                    <button
                        onClick={this.optionToggle}
                        className={classes.optionToggleButton}
                    >
                        <span
                            className={
                                isExpanded
                                    ? classes.optionNameExpanded
                                    : classes.optionName
                            }
                        >
                            {name}
                        </span>
                        <span className={classes.closeWrapper}>
                            <Icon src={isExpanded ? ArrowUp : ArrowDown} />
                        </span>
                    </button>
                </div>
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
                        chosenOptions={chosenFilterOptions || []}
                        updateChosenItems={this.updateChosenItems}
                    />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(FilterBlock);
