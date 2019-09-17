import React from 'react';
import { bool, func, node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './searchTrigger.css';

const SearchTrigger = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { children, toggleSearch, searchOpen } = props;
    const searchClass = searchOpen ? classes.open : classes.root;
    return (
        <button
            className={searchClass}
            aria-label={'Search'}
            onClick={toggleSearch}
        >
            {children}
        </button>
    );
};

SearchTrigger.propTypes = {
    children: node,
    classes: shape({
        root: string,
        open: string
    }),
    searchOpen: bool,
    toggleSearch: func.isRequired
};

export default SearchTrigger;
