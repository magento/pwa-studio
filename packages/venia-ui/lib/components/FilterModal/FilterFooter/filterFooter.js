import React, { useCallback } from 'react';
import { object, shape, string } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { mergeClasses } from '../../../classify';
import defaultClasses from './filterFooter.css';
import isObjectEmpty from '../../../util/isObjectEmpty';
import { preserveQueryParams } from '@magento/peregrine/lib/util/preserveQueryParams';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import serializeToParam from '@magento/peregrine/lib/util/serializeToParam';

const FilterFooter = props => {
    const { history, location } = props;
    const [, { closeDrawer }] = useAppContext();
    const [{ chosenFilterOptions }, catalogApi] = useCatalogContext();
    const { clear: filterClear } = catalogApi.actions.filterOption;

    const resetFilterOptions = useCallback(() => {
        const queryParams = preserveQueryParams(location);
        queryParams
            ? history.push('?' + queryParams.toString())
            : history.push();
        filterClear();
    }, [filterClear, history, location]);

    const handleApplyFilters = useCallback(() => {
        const queryParams = preserveQueryParams(location);
        history.push(
            '?' +
                queryParams.toString() +
                '&' +
                serializeToParam(chosenFilterOptions)
        );
        closeDrawer();
    }, [chosenFilterOptions, closeDrawer, history, location]);

    const classes = mergeClasses(defaultClasses, props.classes);
    const areOptionsPristine = isObjectEmpty(chosenFilterOptions);

    const resetButtonClass = areOptionsPristine
        ? classes.resetButtonDisabled
        : classes.resetButton;

    const applyButtonClass = areOptionsPristine
        ? classes.applyButtonDisabled
        : classes.applyButton;

    return (
        <div className={classes.footer}>
            <button
                onClick={resetFilterOptions}
                disabled={areOptionsPristine}
                className={resetButtonClass}
            >
                Reset Filters
            </button>
            <button
                onClick={handleApplyFilters}
                disabled={areOptionsPristine}
                className={applyButtonClass}
            >
                Apply Filters
            </button>
        </div>
    );
};

FilterFooter.propTypes = {
    classes: shape({
        resetButton: string,
        resetButtonDisabled: string,
        applyButton: string,
        applyButtonDisabled: string,
        footer: string
    }),
    history: object,
    location: object
};

export default withRouter(FilterFooter);
