import querystring from 'querystring';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import SearchAutocomplete from './autocomplete';

import classify from 'src/classify';
import defaultClasses from './searchBar.css';

import Icon from 'src/components/Icon';

const searchURL = '/search.html';
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
        this.autocompleteRef = React.createRef();
        this.state = {
            searchQuery: '',
            autocompleteVisible: false
        };
    }

    componentDidMount = () => {
        if (this.props.history.location.pathname === searchURL) {
            const locationQuery = this.props.location.search.substr(1);
            const params = querystring.parse(locationQuery);
            const { query } = params;
            this.setState({ searchQuery: query ? query : '' });
        }

        document.addEventListener('mousedown', this.autocompleteClick, false);
    };

    componentWillUnmount = () => {
        document.removeEventListener(
            'mousedown',
            this.autocompleteClick,
            false
        );
    };

    updateAutocompleteVisible = visible => {
        this.setState({
            autocompleteVisible: visible
        });
    };

    inputFocus = () => {
        this.updateAutocompleteVisible(true);
    };

    autocompleteClick = e => {
        if (
            this.searchRef.current.contains(e.target) ||
            this.autocompleteRef.current.contains(e.target)
        )
            return;
        this.updateAutocompleteVisible(false);
    };

    enterSearch = event => {
        event.preventDefault();
        const { searchQuery } = this.state;
        this.updateAutocompleteVisible(false);
        if (searchQuery !== '') {
            this.searchRef.current.blur();
            this.props.executeSearch(searchQuery, this.props.history);
        }
    };

    inputChange = event => {
        const { value } = event.currentTarget || event.srcElement;
        this.updateAutocompleteVisible(true);
        this.setState({ searchQuery: value });
    };

    clearSearch = event => {
        event.preventDefault();
        this.searchRef.current.focus();
        this.updateAutocompleteVisible(false);
        this.setState({ searchQuery: '' });
    };

    render() {
        const { classes, isOpen, executeSearch, history } = this.props;
        const { searchQuery, autocompleteVisible } = this.state;

        const searchClass = isOpen
            ? classes.searchBlockOpen
            : classes.searchBlock;

        const clearIconClass = searchQuery
            ? classes.clearIconOpen
            : classes.clearIcon;

        return (
            <div className={searchClass}>
                <form
                    onSubmit={this.enterSearch}
                    className={classes.searchInner}
                >
                    <button type="submit" className={classes.searchIcon}>
                        <Icon name="search" />
                    </button>
                    <input
                        ref={this.searchRef}
                        className={classes.searchBar}
                        inputMode="search"
                        onFocus={this.inputFocus}
                        value={searchQuery}
                        onChange={this.inputChange}
                        type="search"
                        placeholder="I'm looking for..."
                    />
                    <button
                        className={clearIconClass}
                        onClick={this.clearSearch}
                    >
                        <Icon name="x" />
                    </button>
                    <Route
                        exact
                        path={searchURL}
                        render={({ location }) => {
                            const { searchRef } = this;
                            const props = {
                                location,
                                searchRef
                            };

                            return <SeedSearchInput {...props} />;
                        }}
                    />
                    <div
                        className={classes.SearchAutocompleteWrapper}
                        ref={this.autocompleteRef}
                    >
                        <SearchAutocomplete
                            searchQuery={searchQuery}
                            updateAutocompleteVisible={
                                this.updateAutocompleteVisible
                            }
                            autocompleteVisible={autocompleteVisible}
                            executeSearch={executeSearch}
                            history={history}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

/**
 * This class seeds the value of the given input ref with the search query from the URL.
 */
export class SeedSearchInput extends Component {
    static propTypes = {
        // A React Router location.
        // @see https://reacttraining.com/react-router/core/api/location.
        location: PropTypes.object.isRequired,
        // This is a React ref to the search input element,
        searchRef: PropTypes.any.isRequired
    };

    componentDidMount() {
        const { location, searchRef } = this.props;

        // Ignore the "?" at the beginning of location.search.
        const search = location.search.substr(1);

        // @see https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options.
        // Note that this object does not prototypically inherit from JavaScript's `Object`.
        const parsedSearch = querystring.parse(search);

        // But we can still get the value of the query property.
        const value = parsedSearch.query || '';

        // Set the value of the search input element to that of the search query.
        searchRef.current.value = value;
    }

    render() {
        // Do not render anything.
        return null;
    }
}

export default withRouter(classify(defaultClasses)(SearchBar));
