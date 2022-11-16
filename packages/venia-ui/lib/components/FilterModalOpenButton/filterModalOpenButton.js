import React from 'react';
import { shape, string, array } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '../Button';
import { useStyle } from '../../classify';
import defaultClasses from './filterModalOpenButton.module.css';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';

const FilterModalOpenButton = props => {
    const { filters, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    const { handleOpen } = useFilterModal({ filters });
    const handleKeypress = e => {
        if (e.code == 'Enter') {
            handleOpen;
        }
    };
    const { formatMessage } = useIntl();
    return (
        <Button
            priority={'low'}
            classes={{
                root_lowPriority: classes.filterButton
            }}
            data-cy="FilterModalOpenButton-button"
            onClick={handleOpen}
            onKeyDown={handleKeypress}
            type="button"
            aria-live="polite"
            aria-busy="false"
            aria-label={formatMessage({
                id: 'filterModalOpenButton.ariaLabel',
                defaultMessage: 'Filter Button for Filter Options'
            })}
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
    classes: shape({
        filterButton: string
    }),
    filters: array
};
