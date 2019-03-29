import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import FilterFooter from './FilterFooter';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
import { FiltersCurrent } from './FiltersCurrent';
import classify from 'src/classify';
import CloseIcon from 'react-feather/dist/icons/x';
import Icon from 'src/components/Icon';
import FilterBlock from './filterBlock';
import defaultClasses from './filterModal.css';

class FilterModal extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            modalWrapper: PropTypes.string,
            header: PropTypes.string,
            headerTitle: PropTypes.string,
            filterOptionsContainer: PropTypes.string
        }),
        filters: PropTypes.arrayOf(
            PropTypes.shape({
                request_var: PropTypes.string,
                items: PropTypes.array
            })
        ),
        filterAdd: PropTypes.func,
        filterRemove: PropTypes.func,
        closeModalHandler: PropTypes.func
    };

    render() {
        const { classes, drawer, closeModalHandler } = this.props;
        const modalClass =
            drawer === 'filter' ? classes.rootOpen : classes.root;

        if (!this.props.filters) return null;

        return (
            <div className={modalClass}>
                <div className={classes.modalWrapper}>
                    <div className={classes.header}>
                        <span className={classes.headerTitle}>FILTER BY</span>
                        <button onClick={closeModalHandler}>
                            <Icon src={CloseIcon} />
                        </button>
                    </div>

                    <FiltersCurrent keyPrefix="modal" />

                    <List
                        items={this.props.filters}
                        getItemKey={({ request_var }) => request_var}
                        render={props => (
                            <ul className={classes.filterOptionsContainer}>
                                {props.children}
                            </ul>
                        )}
                        renderItem={props => (
                            <FilterBlock
                                item={props.item}
                                filterAdd={this.props.filterAdd}
                                filterRemove={this.props.filterRemove}
                            />
                        )}
                    />
                </div>
                <FilterFooter closeModalHandler={closeModalHandler} />
            </div>
        );
    }
}

const mapStateToProps = ({ app }) => {
    return {
        drawer: app.drawer
    };
};

export default compose(
    connect(mapStateToProps),
    classify(defaultClasses)
)(FilterModal);
