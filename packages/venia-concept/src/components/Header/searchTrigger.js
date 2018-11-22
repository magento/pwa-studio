import React, { Component } from 'react';
import { withRouter } from 'react-router';
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
        toggleSearch: PropTypes.func.isRequired,
        searchOpen: PropTypes.bool
    };

    async componentDidMount() {
        if (
            this.props.location.pathname === '/search.html' &&
            this.props.searchOpen !== true
        ) {
            this.props.toggleSearch();
        }
    }

    render() {
        const { children, classes, toggleSearch, searchOpen } = this.props;
        const searchClass = searchOpen ? classes.open : classes.root;

        return (
            <button className={searchClass} onClick={toggleSearch}>
                {children}
            </button>
        );
    }
}

export default withRouter(classify(defaultClasses)(SearchTrigger));
