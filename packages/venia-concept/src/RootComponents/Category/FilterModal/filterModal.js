import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
import get from 'lodash/get';
import classify from 'src/classify';
import Filter from 'src/components/Filter';
import Icon from 'src/components/Icon';
import FilterOption from './FilterOption';
import defaultClasses from './filterModal.css';
import { filterIconName, filterInnerText, filterOptions } from './constants';

const iconAttrs = {
    width: 16
};

class FilterModal extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            searchFilterContainer: PropTypes.string
        }),
        closeModalHandler: PropTypes.func,
        chosenFilterOptions: PropTypes.object,
        updateChosenFilterOptions: PropTypes.func
    };

    static getDerivedStateFromProps(nextProps) {
        const { chosenFilterOptions } = nextProps;
        let filterOptionsArePristine = true;

        for (const optionName in chosenFilterOptions) {
            if (chosenFilterOptions[optionName].chosenItems.length > 0) {
                filterOptionsArePristine = false;
                break;
            }
        }

        return { areOptionsPristine: filterOptionsArePristine };
    }

    state = {
        areOptionsPristine: true,
        expandedOptions: {}
    };

    resetFilterOptions = () => {
        const { updateChosenFilterOptions } = this.props;
        this.setState({ expandedOptions: {} }, () => {
            updateChosenFilterOptions({});
        });
    };

    getFooterButtons = areOptionsPristine => {
        const { classes } = this.props;
        return (
            <Fragment>
                <button
                    onClick={this.resetFilterOptions}
                    className={
                        areOptionsPristine
                            ? classes.resetButtonDisabled
                            : classes.resetButton
                    }
                >
                    Reset all filters
                </button>
                <button
                    className={
                        areOptionsPristine
                            ? classes.applyButtonDisabled
                            : classes.applyButton
                    }
                >
                    Apply all filters
                </button>
            </Fragment>
        );
    };

    getChosenFilterOptionsForItem = itemName => {
        const { chosenFilterOptions } = this.props;
        return get(chosenFilterOptions, `${itemName}.chosenItems`, []);
    };

    getIsExpanded = optionName => {
        return !!this.state.expandedOptions[optionName];
    };

    toggleOption = optionName => {
        const { expandedOptions } = this.state;
        !!expandedOptions[optionName]
            ? this.setState({
                  expandedOptions: Object.assign({}, expandedOptions, {
                      [optionName]: false
                  })
              })
            : this.setState({
                  expandedOptions: Object.assign({}, expandedOptions, {
                      [optionName]: true
                  })
              });
    };

    render() {
        const {
            classes,
            closeModalHandler,
            updateChosenFilterOptions
        } = this.props;
        const { areOptionsPristine } = this.state;

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <span className={classes.headerTitle}>FILTER BY</span>
                    <button onClick={closeModalHandler}>
                        <Icon name="x" attrs={iconAttrs} />
                    </button>
                </div>
                <div className={classes.searchFilterContainer}>
                    <Filter
                        iconName={filterIconName}
                        innerText={filterInnerText}
                    />
                </div>
                <List
                    items={filterOptions}
                    getItemKey={({ id }) => id}
                    render={props => (
                        <ul className={classes.filterOptionsContainer}>
                            {props.children}
                        </ul>
                    )}
                    renderItem={props => (
                        <li className={classes.filterOptionItem}>
                            <FilterOption
                                {...props}
                                toggleOption={this.toggleOption}
                                isExpanded={this.getIsExpanded(props.item.name)}
                                chosenFilterOptions={this.getChosenFilterOptionsForItem(
                                    props.item.name
                                )}
                                updateChosenFilterOptions={actualItems =>
                                    updateChosenFilterOptions({
                                        optionName: props.item.name,
                                        optionItems: actualItems
                                    })
                                }
                            />
                        </li>
                    )}
                />
                <div className={classes.footer}>
                    {this.getFooterButtons(areOptionsPristine)}
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(FilterModal);
