import React from 'react';
import { func, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '../Button';
import { mergeClasses } from '../../classify';
import defaultClasses from './filterModalOpenButton.css';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';

const FilterModalOpenButton = props => {
    const { filters, classes: propsClasses } = props;
    const classes = mergeClasses(defaultClasses, propsClasses);
    const { handleOpen } = useFilterModal({ filters });

    return (
        <Button
            priority={'low'}
            classes={{
                root_lowPriority: classes.filterButton
            }}
            onClick={handleOpen}
            // onFocus={onFocusAction}
            // onMouseOver={onMouseOverAction}
            type="button"
        >
            <FormattedMessage
                id={'productList.filter'}
                defaultMessage={'Filter'}
            />
        </Button>
    );
};

export default FilterModalOpenButton;

FilterModalOpenButton.propTypes = {
    handleOpenFilters: func,
    handleLoadFilters: func,
    classes: shape({
        filterButton: string
    })
};
