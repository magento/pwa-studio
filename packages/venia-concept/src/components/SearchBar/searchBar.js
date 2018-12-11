import querystring from 'querystring';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import classify from 'src/classify';
import defaultClasses from './searchBar.css';

import Icon from 'src/components/Icon';

export class SearchBar extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            searchBlock: PropTypes.string,
            searchBlockOpen: PropTypes.string,
            searchBar: PropTypes.string,
            searchIcon: PropTypes.string
        }),
        isOpen: PropTypes.bool,
        executeSearch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.searchRef = React.createRef();
        this.state = { isClearIcon: false };
    }

    async componentDidMount() {
        if (this.props.location) {
            if (this.props.location.pathname === '/search.html') {
                this.searchRef.current.value = this.props.location.search.substring(
                    7
                );
                this.setClearIcon(this.searchRef.current.value);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen !== prevProps.isOpen) {
            if (this.props.isOpen == true) {
                this.searchRef.current.focus();
            } else {
                this.searchRef.current.blur();
            }
        }
    }

    enterSearch = event => {
        const searchQuery = this.searchRef.current.value;
        this.setClearIcon(searchQuery);
        if (
            this.props.isOpen &&
            (event.type === 'click' || event.key === 'Enter') &&
            searchQuery !== ''
        ) {
            this.props.executeSearch(searchQuery, this.props.history);
        }
    };

    clearSearch = () => {
        this.searchRef.current.value = '';
        this.searchRef.current.focus();
        this.setClearIcon(this.searchRef.current.value);
    };

    setClearIcon(query) {
        if (query !== '') {
            this.setState(() => {
                return { isClearIcon: true };
            });
        } else {
            this.setState(() => {
                return { isClearIcon: false };
            });
        }
    }

    render() {
        const { classes, isOpen } = this.props;

        const searchClass = isOpen
            ? classes.searchBlockOpen
            : classes.searchBlock;

        const clearIconClass = this.state.isClearIcon
            ? classes.clearIcon
            : classes.clearIcon_off;

        return (
            <div className={searchClass}>
                <button
                    className={classes.searchIcon}
                    onClick={this.enterSearch}
                >
                    <Icon name="search" />
                </button>
                <input
                    ref={this.searchRef}
                    className={classes.searchBar}
                    inputMode="search"
                    type="search"
                    placeholder="I'm looking for..."
                    onKeyUp={this.enterSearch}
                />
                <button className={clearIconClass} onClick={this.clearSearch}>
                    <Icon name="x" />
                </button>
                <Route
                    exact
                    path="/search.html"
                    render={({ location }) => {
                        const { searchRef, setClearIcon } = this;
                        const props = {
                            location,
                            searchRef,
                            setClearIcon: setClearIcon.bind(this)
                        };

                        return <SeedSearchInput {...props} />;
                    }}
                />
            </div>
        );
    }
}

/**
 * This class seeds the value of the given input ref with the search query from the URL.
 */
class SeedSearchInput extends Component {
    static propTypes = {
        // A React Router location.
        // @see https://reacttraining.com/react-router/core/api/location.
        location: PropTypes.object.isRequired,
        // This is a React ref to the search input element,
        searchRef: PropTypes.any.isRequired,
        setClearIcon: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { location, searchRef, setClearIcon } = this.props;

        // Ignore the "?" at the beginning of location.search.
        const search = location.search.substr(1);

        // @see https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options.
        // Note that this object does not prototypically inherit from JavaScript's `Object`.
        const parsedSearch = querystring.parse(search);

        // But we can still get the value of the query property.
        const value = parsedSearch.query || '';

        // Set the value of the search input element to that of the search query.
        searchRef.current.value = value;

        // And update the icon.
        setClearIcon(value);
    }

    render() {
        // Do not render anything.
        return null;
    }
}

export default withRouter(classify(defaultClasses)(SearchBar));
