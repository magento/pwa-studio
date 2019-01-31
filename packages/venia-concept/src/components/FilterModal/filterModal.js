import React, { Component } from 'react';
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

    getFilterParams = location => {
        const params = new URLSearchParams(location.search);
        let titles,
            values = [];

        let urlFilterParams = {};

        for (var key of params.keys()) {
            const cleanKey = key.replace(/\[\]\[.*\]/gm, '');

            if (urlFilterParams[cleanKey]) continue;

            titles = params.getAll(`${cleanKey}[][title]`);
            values = params.getAll(`${cleanKey}[][value]`);

            urlFilterParams[cleanKey] = titles.map((title, index) => ({
                title: title,
                value: values[index]
            }));
        }

        return urlFilterParams;
    };

    componentDidMount = () => {
        const filterParams = this.getFilterParams(this.props.history.location);
        for (var key in filterParams) {
            if (filterParams.hasOwnProperty(key)) {
                filterParams[key].map(({ title, value }) => {
                    this.props.filterAdd({
                        group: key,
                        title,
                        value
                    });
                });
            }
        }
    };

    render() {
        const { classes, isModalOpen, closeModalHandler } = this.props;
        const modalClass = isModalOpen ? classes.rootOpen : classes.root;

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

export default classify(defaultClasses)(FilterModal);
