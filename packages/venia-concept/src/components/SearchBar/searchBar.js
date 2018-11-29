import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import queryString from 'query-string';
import PropTypes from 'prop-types';
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

        this.state = {
            searchQuery: '',
            autocompleteVisible: false
        };

        this.autocompleteRef = React.createRef();
        this.searchRef = React.createRef();
    }

    async componentDidMount() {
        if (this.props.history.location.pathname === searchURL) {
            const params = queryString.parse(this.props.location.search);
            this.setState({ searchQuery: params.query });
        }

        document.addEventListener(
            'mousedown',
            this.handleAutocompleteClick,
            false
        );
    }

    componentWillUnmount = () => {
        document.removeEventListener(
            'mousedown',
            this.handleAutocompleteClick,
            false
        );
    };

    updateAutocompleteVisible = visible => {
        this.setState({
            autocompleteVisible: visible
        });
    };

    handleOnInputFocus = () => {
        this.updateAutocompleteVisible(true);
    };

    handleOnChange = event => {
        const { value } = event.currentTarget || event.srcElement;
        this.updateAutocompleteVisible(true);
        this.setState({ searchQuery: value });
    };

    handleAutocompleteClick = e => {
        if (
            this.searchRef.current.contains(e.target) ||
            this.autocompleteRef.current.contains(e.target)
        )
            return;
        this.updateAutocompleteVisible(false);
    };

    handleSearchSubmit = event => {
        event.preventDefault();
        const { searchQuery } = this.state;
        this.updateAutocompleteVisible(false);
        if (searchQuery !== '')
            this.props.executeSearch(searchQuery, this.props.history);
    };

    handleClearSearch = () => {
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

        const clearClass = searchQuery
            ? classes.clearIconOpen
            : classes.clearIcon;

        return (
            <div className={searchClass}>
                <form
                    onSubmit={this.handleSearchSubmit}
                    className={classes.searchInner}
                >
                    <button type="submit" className={classes.searchIcon}>
                        <Icon name="search" />
                    </button>
                    <input
                        ref={this.searchRef}
                        value={searchQuery}
                        className={classes.searchBar}
                        onFocus={this.handleOnInputFocus}
                        inputMode="search"
                        type="search"
                        placeholder="I'm looking for..."
                        onChange={this.handleOnChange}
                    />
                    <button
                        className={clearClass}
                        onClick={this.handleClearSearch}
                    >
                        <Icon name="x" />
                    </button>
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
