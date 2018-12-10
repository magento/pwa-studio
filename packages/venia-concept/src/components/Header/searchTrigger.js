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
        toggleSearch: PropTypes.func.isRequired,
        searchOpen: PropTypes.bool
    };

    state = {
        isMounted: false
    };

    componentDidMount () {
        this.setState({ isMounted: true });
    }

    render() {
        const { children, classes, toggleSearch, searchOpen } = this.props;
        const { isMounted } = this.state;
        const searchClass = searchOpen ? classes.open : classes.root;

        return (
            <Fragment>
                <button className={searchClass} onClick={toggleSearch}>
                    {children}
                </button>

                {!isMounted && (
                    <Route exact path="/search.html" render={() => {
                        // If the app loads on the search page - via bookmark or similar -
                        // force the search bar to be open.
                        if (this.props.searchOpen !== true) {
                            this.props.toggleSearch();
                        }

                        // This Route should never render anything additional.
                        return null;
                    }}>
                    </Route>
                )}
            </Fragment>
        );
    }
}

export default classify(defaultClasses)(SearchTrigger);
