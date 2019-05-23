import React, { useCallback } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useDropdown } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import Autocomplete from './autocomplete';
import SearchField from './searchField';
import defaultClasses from './searchBar.css';

const initialValues = { search_query: '' };

const SearchBar = props => {
    const { history, isOpen, location } = props;
    const { elementRef, expanded, setExpanded } = useDropdown();

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;

    // expand or collapse on input change
    const handleChange = useCallback(value => {
        setExpanded(!!value);
    }, []);

    // expand on focus
    const handleFocus = useCallback(() => {
        setExpanded(true);
    }, []);

    // navigate on submit
    const handleSubmit = useCallback(
        ({ search_query }) => {
            history.push(`/search.html?query=${search_query}`);
        },
        [history]
    );

    return (
        <div className={rootClassName}>
            <div ref={elementRef} className={classes.container}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.search}>
                        <SearchField
                            location={location}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                    </div>
                    <div className={classes.autocomplete}>
                        <Autocomplete
                            setVisible={setExpanded}
                            visible={expanded}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SearchBar;

SearchBar.propTypes = {
    classes: shape({
        autocomplete: string,
        container: string,
        form: string,
        root: string,
        root_open: string,
        search: string
    }),
    history: shape({
        push: func.isRequired
    }).isRequired,
    isOpen: bool,
    location: shape({}).isRequired
};
