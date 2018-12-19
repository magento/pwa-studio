import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import SearchAutocomplete from './autocomplete';
import { getSearchParams } from 'src/util/getSearchParams';

import Icon from 'src/components/Icon';
getSearchParams;
import SeedSearchInput from './seedSearchInput';

import classify from 'src/classify';
import defaultClasses from './searchBar.css';

export class SearchBar extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            clearIcon: PropTypes.string,
            clearIcon_off: PropTypes.string,
            root: PropTypes.string,
            searchBlock: PropTypes.string,
            searchBlockOpen: PropTypes.string,
            searchBar: PropTypes.string,
            searchIcon: PropTypes.string
        }),
        executeSearch: PropTypes.func.isRequired,
        history: PropTypes.object,
        isOpen: PropTypes.bool,
        location: PropTypes.object,
        match: PropTypes.object
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
        document.addEventListener('mousedown', this.autocompleteClick, false);
        const { inputText } = getSearchParams();
        if (inputText) this.setState({ searchQuery: inputText });
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
                        path="/search.html"
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

export default withRouter(classify(defaultClasses)(SearchBar));
