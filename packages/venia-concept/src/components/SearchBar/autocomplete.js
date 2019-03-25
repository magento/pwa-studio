import React, { useEffect } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useFieldState } from 'informed';
import { useQuery } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import PRODUCT_SEARCH from 'src/queries/productSearch.graphql';
import Suggestions from './suggestions';
import defaultClasses from './autocomplete.css';

const Autocomplete = props => {
    const { setVisible, visible } = props;

    const [queryResult, queryApi] = useQuery(PRODUCT_SEARCH);
    const { data, error, loading } = queryResult;
    const { resetState, runQuery, setLoading } = queryApi;

    const { value } = useFieldState('search_query');
    const valid = value && value.length > 2;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = visible ? classes.root_visible : classes.root_hidden;
    let message = '';

    if (error) {
        message = 'An error occurred while fetching results.';
    } else if (loading) {
        message = 'Fetching results...';
    } else if (!data) {
        message = 'Search for a product';
    } else if (!data.products.items.length) {
        message = 'No results were found.';
    } else {
        message = `${data.products.items.length} items`;
    }

    // run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (visible && valid) {
            setLoading(true);
            runQuery({ variables: { inputText: value } });
        } else if (!value) {
            resetState();
        }
    }, [resetState, runQuery, setLoading, valid, value, visible]);

    return (
        <div className={rootClassName}>
            <div className={classes.message}>{message}</div>
            <div className={classes.suggestions}>
                <Suggestions
                    products={data ? data.products : {}}
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
