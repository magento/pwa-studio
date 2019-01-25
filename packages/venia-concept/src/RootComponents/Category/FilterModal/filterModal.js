import React, { Component, Fragment } from 'react';
import FilterFooter from './FilterFooter';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
import { FiltersCurrent } from './FiltersCurrent';
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

    render() {
        const {
            classes,
            isModalOpen,
            closeModalHandler,
            filterSet,
            filterAdd,
            filterRemove,
            filters
        } = this.props;

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
                        <FilterBlock
                            item={props.item}
                            filterSet={filterSet}
                            filterAdd={filterAdd}
                            filterRemove={filterRemove}
                        />
                    )}
                />
                <FilterFooter />
            </div>
        );
    }
}

export default classify(defaultClasses)(FilterModal);
