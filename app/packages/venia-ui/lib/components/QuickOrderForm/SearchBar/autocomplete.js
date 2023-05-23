import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useAutocomplete } from '@magento/peregrine/lib/talons/QuickOrderForm/useAutocomplete';
import { useIntl } from 'react-intl';

import defaultClasses from './autocomplete.module.css';
import Suggestions from './suggestions';
import { useStyle } from '@magento/venia-ui/lib/classify';

const Autocomplete = props => {
    const { setVisible, valid, visible, handleSearchClick, value } = props;
    const talonProps = useAutocomplete({
        inputText: value,
        valid,
        visible
    });
    const { displayResult, filters, messageType, products, resultCount } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);
    const rootClassName = visible ? classes.root_visible : classes.root_hidden;

    const { formatMessage } = useIntl();
    const MESSAGES = new Map()
        .set(
            'ERROR',
            formatMessage({
                id: 'autocomplete.error',
                defaultMessage: 'An error occurred while fetching results.'
            })
        )
        .set(
            'LOADING',
            formatMessage({
                id: 'autocomplete.loading',
                defaultMessage: 'Fetching results...'
            })
        )
        .set(
            'PROMPT',
            formatMessage({
                id: 'autocomplete.prompt',
                defaultMessage: 'Search for a product'
            })
        )
        .set(
            'EMPTY_RESULT',
            formatMessage({
                id: 'autocomplete.emptyResult',
                defaultMessage: 'No results were found.'
            })
        )
        .set('RESULT_SUMMARY', (_, resultCount) =>
            formatMessage(
                {
                    id: 'autocomplete.resultSummary',
                    defaultMessage: '{resultCount} items'
                },
                { resultCount: resultCount }
            )
        )
        .set(
            'INVALID_CHARACTER_LENGTH',
            formatMessage({
                id: 'autocomplete.invalidCharacterLength',
                defaultMessage: 'Search term must be at least three characters'
            })
        );

    const messageTpl = MESSAGES.get(messageType);
    const message = typeof messageTpl === 'function' ? messageTpl`${resultCount}` : messageTpl;

    return (
        <div data-cy="Autocomplete-root" className={`${rootClassName} ${defaultClasses.quickOrder}`}>
            <div data-cy="Autocomplete-message" className={classes.message}>
                {message}
            </div>
            <div className={classes.suggestions}>
                <Suggestions
                    displayResult={displayResult}
                    products={products || {}}
                    filters={filters}
                    searchValue={value}
                    setVisible={setVisible}
                    visible={visible}
                    handleSearchClick={handleSearchClick}
                />
            </div>
        </div>
    );
};

export default Autocomplete;

Autocomplete.propTypes = {
    classes: shape({
        message: string,
        root_hidden: string,
        root_visible: string,
        suggestions: string
    }),
    setVisible: func,
    visible: bool
};
