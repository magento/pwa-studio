import React from 'react';
import gql from 'graphql-tag';
import { bool, func, shape, string } from 'prop-types';
import { useAutocomplete } from '@magento/peregrine/lib/talons/SearchBar';

import defaultClasses from './autocomplete.css';
import { mergeClasses } from '../../classify';
import Suggestions from './suggestions';

const MESSAGES = new Map()
    .set('ERROR', 'An error occurred while fetching results.')
    .set('LOADING', 'Fetching results...')
    .set('PROMPT', 'Search for a product')
    .set('EMPTY_RESULT', 'No results were found.')
    .set('RESULT_SUMMARY', (_, resultCount) => `${resultCount} items`);

const GET_AUTOCOMPLETE_RESULTS = gql`
    query getAutocompleteResults($inputText: String!) {
        # Limit results to first three.
        products(search: $inputText, currentPage: 1, pageSize: 3) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
            }
            items {
                id
                name
                small_image {
                    url
                }
                url_key
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
            page_info {
                total_pages
            }
            total_count
        }
    }
`;

const Autocomplete = props => {
    const { setVisible, valid, visible } = props;
    const talonProps = useAutocomplete({
        queries: {
            getAutocompleteResults: GET_AUTOCOMPLETE_RESULTS
        },
        valid,
        visible
    });
    const {
        displayResult,
        filters,
        messageType,
        products,
        resultCount,
        value
    } = talonProps;

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
                    displayResult={displayResult}
                    products={products || {}}
                    filters={filters}
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
