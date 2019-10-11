import React, { useMemo } from 'react';
import FilterFooter from './FilterFooter';
import { array, arrayOf, shape, string } from 'prop-types';
import { mergeClasses } from '../../classify';
import { X as CloseIcon } from 'react-feather';
import Icon from '../Icon';
import FilterBlock from './filterBlock';
import CurrentFilters from './CurrentFilters';
import defaultClasses from './filterModal.css';
import { Modal } from '../Modal';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal/useFilterModal';
/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { filters } = props;

    const { drawer, handleClose } = useFilterModal();

    const filtersList = useMemo(
        () =>
            filters.map(item => {
                return <FilterBlock key={item.request_var} item={item} />;
            }),
        [filters]
    );

    const classes = mergeClasses(defaultClasses, props.classes);
    const modalClass = drawer === 'filter' ? classes.rootOpen : classes.root;

    return (
        <Modal>
            <aside className={modalClass}>
                <div className={classes.modalWrapper}>
                    <div className={classes.header}>
                        <span className={classes.headerTitle}>FILTER BY</span>
                        <button onClick={handleClose}>
                            <Icon src={CloseIcon} />
                        </button>
                    </div>

                    <CurrentFilters keyPrefix="modal" />
                    <ul className={classes.filterOptionsContainer}>
                        {filtersList}
                    </ul>
                </div>
                <FilterFooter />
            </aside>
        </Modal>
    );
};

FilterModal.propTypes = {
    classes: shape({
        root: string,
        modalWrapper: string,
        header: string,
        headerTitle: string,
        filterOptionsContainer: string
    }),
    filters: arrayOf(
        shape({
            request_var: string,
            items: array
        })
    )
};

export default FilterModal;
