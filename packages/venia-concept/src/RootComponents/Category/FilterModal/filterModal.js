import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
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
        closeModalHandler: PropTypes.func
    };

    state = {
        filterSearchTerm: ''
    };

    resetFilterOptions = () => {
        const { filterClear } = this.props;
        filterClear();
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

    render() {
        const {
            classes,
            isModalOpen,
            closeModalHandler,
            filterAdd,
            filterRemove,
            filters
        } = this.props;

        const areOptionsPristine = false;

        const modalClass = isModalOpen ? classes.rootOpen : classes.root;

        return (
            <div className={modalClass}>
                <div className={classes.header}>
                    <span className={classes.headerTitle}>FILTER BY</span>
                    <button onClick={closeModalHandler}>
                        <Icon src={CloseIcon} />
                    </button>
                </div>

                <FiltersCurrent keyPrefix="modal" />

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
                                filterAdd={filterAdd}
                                filterRemove={filterRemove}
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
