import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useAutocomplete } from '@magento/peregrine/lib/talons/SearchBar';

import { mergeClasses } from '../../classify';
import PRODUCT_SEARCH from '../../queries/productSearch.graphql';
import Suggestions from './suggestions';
import defaultClasses from './autocomplete.css';

const MESSAGES = new Map()
    .set('ERROR', 'An error occurred while fetching results.')
    .set('LOADING', 'Fetching results...')
    .set('PROMPT', 'Search for a product')
    .set('EMPTY_RESULT', 'No results were found.')
    .set('RESULT_SUMMARY', (_, resultCount) => `${resultCount} items`);

const Autocomplete = props => {
    const { setVisible, visible } = props;
    const talonProps = useAutocomplete({ query: PRODUCT_SEARCH, visible });
    const { messageType, products, resultCount, value } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = visible ? classes.root_visible : classes.root_hidden;

    const messageTpl = MESSAGES.get(messageType);
    const message =
        typeof messageTpl === 'function'
            ? messageTpl`${resultCount}`
            : messageTpl;

    return (
        <div className={rootClassName}>
            <div className={classes.message}>{message}</div>
            <div className={classes.suggestions}>
                <Suggestions
                    products={products || {}}
                    searchValue={value}
                    setVisible={setVisible}
                    visible={visible}
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
