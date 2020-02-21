import React from 'react';
import { bool, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSearchBar } from '@magento/peregrine/lib/talons/SearchBar';

import { mergeClasses } from '../../classify';
import Autocomplete from './autocomplete';
import SearchField from './searchField';
import defaultClasses from './searchBar.css';

const SearchBar = props => {
    const { isOpen } = props;
    const talonProps = useSearchBar();
    const {
        containerRef,
        expanded,
        handleChange,
        handleFocus,
        handleSubmit,
        initialValues,
        setExpanded,
        valid
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;

    return (
        <div className={rootClassName}>
            <div ref={containerRef} className={classes.container}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.search}>
                        <SearchField
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                    </div>
                    <div className={classes.autocomplete}>
                        <Autocomplete
                            setVisible={setExpanded}
                            valid={valid}
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
    isOpen: bool
};
