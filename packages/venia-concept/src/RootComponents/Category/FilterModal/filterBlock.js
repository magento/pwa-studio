import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import FilterList from './FilterList';
import CloseIcon from 'react-feather/dist/icons/x-circle';
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
        chosenFilterOptions: PropTypes.array,
        updateChosenFilterOptions: PropTypes.func,
        isExpanded: PropTypes.bool
    };

    resetChosenItems = () => {
        this.updateChosenItems([]);
    };

    optionToggle = () => {
        const {
            toggleOption,
            item: { name }
        } = this.props;
        toggleOption(name);
    };

    updateChosenItems = actualItems => {
        const { updateChosenFilterOptions } = this.props;
        updateChosenFilterOptions(actualItems);
    };

    render() {
        const {
            classes,
            item: { name, filter_items, request_var },
            chosenFilterOptions,
            isExpanded
        } = this.props;
        const chosenOptions = chosenFilterOptions;

        return (
            <div className={classes.root}>
                <div className={classes.optionHeader}>
                    <div className={classes.optionName}>{name}</div>
                    <div className={classes.counterAndCloseButtonContainer}>
                        <button
                            onClick={this.optionToggle}
                            className={classes.optionToggleButton}
                        >
                            <Icon src={isExpanded ? ArrowUp : ArrowDown} />
                        </button>
                    </div>
                </div>
                {isExpanded ? (
                    <FilterList
                        id={request_var}
                        items={filter_items}
                        chosenOptions={chosenOptions}
                        updateChosenItems={this.updateChosenItems}
                    />
                ) : null}
            </div>
        );
    }
}

export default classify(defaultClasses)(FilterBlock);
