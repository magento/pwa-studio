import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './searchTrigger.css';

class SearchTrigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string,
            open: PropTypes.string
        }),
        searchOpen: PropTypes.bool,
        toggleSearch: PropTypes.func.isRequired
    };

    render() {
        const { children, classes, toggleSearch, searchOpen } = this.props;
        const searchClass = searchOpen ? classes.open : classes.root;

        return (
            <Fragment>
                <button className={searchClass} onClick={toggleSearch}>
                    {children}
                </button>
            </Fragment>
        );
    }
}

export default classify(defaultClasses)(SearchTrigger);
