import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
import get from 'lodash/get';
import FiltersCurrent from './filtersCurrentContainer';
import classify from 'src/classify';
import CloseIcon from 'react-feather/dist/icons/x';
import Icon from 'src/components/Icon';
import FilterBlock from './FilterBlock';
import defaultClasses from './filterModal.css';

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
        filterSearchTerm: '',
        areOptionsPristine: true,
        expandedOptions: {}
    };

    resetFilterOptions = () => {
        const { updateChosenFilterOptions } = this.props;
        updateChosenFilterOptions({});
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

    handleFilterSearch = event => {
        const { value } = event.currentTarget || event.srcElement;
        this.setState({ filterSearchTerm: value });
    };

    render() {
        const {
            classes,
            isModalOpen,
            closeModalHandler,
            updateChosenFilterOptions
        } = this.props;
        let { filters } = this.props;
        const { areOptionsPristine, filterSearchTerm } = this.state;

        filters = filters.filter(
            filter =>
                `${filter.name}`
                    .toUpperCase()
                    .indexOf(filterSearchTerm.toUpperCase()) >= 0
        );

        const modalClass = isModalOpen ? classes.rootOpen : classes.root;

        return (
            <div className={modalClass}>
                <div className={classes.header}>
                    <span className={classes.headerTitle}>FILTER BY</span>
                    <button onClick={closeModalHandler}>
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.searchFilterContainer}>
                    <input onChange={this.handleFilterSearch} type="text" />
                </div>

                <FiltersCurrent />

                <List
                    items={filters}
                    getItemKey={({ request_var }) => request_var}
                    render={props => (
                        <ul className={classes.filterOptionsContainer}>
                            {props.children}
                        </ul>
                    )}
                    renderItem={props => (
                        <li className={classes.filterOptionItem}>
                            <FilterBlock
                                item={props.item}
                                toggleOption={this.toggleOption}
                                isExpanded={this.getIsExpanded(props.item.name)}
                                chosenFilterOptions={this.getChosenFilterOptionsForItem(
                                    props.item.request_var
                                )}
                                updateChosenFilterOptions={actualItems =>
                                    updateChosenFilterOptions({
                                        optionName: props.item.request_var,
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
