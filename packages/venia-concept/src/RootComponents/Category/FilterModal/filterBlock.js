import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import get from 'lodash/get';
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

    getChosenFilterOptionsForItem = () => {
        const { chosenFilterOptions } = this.props;
        return get(chosenFilterOptions, `chosenItems`, []);
    };

    render() {
        const {
            classes,
            item: { name, filter_items, request_var },
            chosenFilterOptions
        } = this.props;

        const { isExpanded } = this.state;

        const chosenOptions = this.getChosenFilterOptionsForItem(
            chosenFilterOptions
        );

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
                <FilterList
                    id={request_var}
                    items={filter_items}
                    chosenOptions={chosenOptions}
                    updateChosenItems={this.updateChosenItems}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(FilterBlock);
