import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
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
                <Route exact path="/search.html" render={() => {
                    const { searchOpen, toggleSearch } = this.props;
                    const props = { searchOpen, toggleSearch };

                    return <EnsureOpenSearch {...props} />
                }}>
                </Route>
            </Fragment>
        );
    }
};

class EnsureOpenSearch extends Component {
    static propTypes = {
        searchOpen: PropTypes.bool,
        toggleSearch: PropTypes.func.isRequired
    };

    componentDidMount () {
        const { searchOpen, toggleSearch } = this.props;
        if (searchOpen !== true) {
            toggleSearch();
        }
    }

    render () {
        // Do not render anything.
        return null;
    }
};

export default classify(defaultClasses)(SearchTrigger);
