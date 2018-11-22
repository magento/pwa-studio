import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import SearchAutocomplete from './autocomplete';
import classify from 'src/classify';
import { executeSearch } from 'src/actions/app';
import defaultClasses from './searchBar.css';
import { debounce } from 'underscore';
import Icon from 'src/components/Icon';

const debounceTimeout = 200;

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
            autocompleteQuery: '',
            searchQuery: '',
            autocompleteVisible: false
        };

        this.autocompleteRef = React.createRef();
        this.searchRef = React.createRef();
    }

    async componentDidMount() {
        if (this.props.isOpen) {
            this.updateAutocompleteVisible(true);
        }
        if (document.location.pathname === '/search.html') {
            const params = new URL(document.location).searchParams;
            this.updateSearchState(params.get('query'));
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

    componentDidUpdate(prevProps) {
        if (this.props.isOpen !== prevProps.isOpen) {
            if (this.props.isOpen == true) {
                this.searchRef.current.focus();
                this.updateAutocompleteVisible(true);
            } else {
                this.searchRef.current.blur();
                this.updateAutocompleteVisible(false);
            }
        }
    }

    updateSearchState = value => {
        this.setState({ searchQuery: value });
        this.updateAutocompleteQuery(value);
    };

    /* Debounce this update in order to avoid multiple autocomplete query calls */
    updateAutocompleteQuery = debounce(value => {
        this.setState({
            autocompleteQuery: value
        });
    }, debounceTimeout);

    updateAutocompleteVisible = (visible = true) => {
        this.setState({
            autocompleteVisible: visible
        });
    };

    handleAutocompleteClick = e => {
        if (
            this.searchRef.current.contains(e.target) ||
            this.autocompleteRef.current.contains(e.target)
        )
            return;
        this.updateAutocompleteVisible(false);
    };

    handleOnChange = event => {
        const { value } = event.currentTarget || event.srcElement;
        this.updateSearchState(value);
    };

    handleOnKeyDown = event => {
        const { value } = event.currentTarget || event.srcElement;
        if (event.key === 'Enter' && value !== '') {
            this.updateAutocompleteVisible(false);
            this.props.executeSearch(value, this.props.history, id);
        } else {
            this.updateAutocompleteVisible(true);
        }
    };

    handleSearchSubmit = () => {
        this.updateAutocompleteVisible(false);
        this.props.executeSearch(this.state.searchQuery, this.props.history);
    };

    handleCategorySearch = event => {
        event.preventDefault();
        const { id } = event.currentTarget.dataset || event.srcElement.dataset;
        this.updateAutocompleteVisible(false);
        this.props.executeSearch(
            this.state.searchQuery,
            this.props.history,
            id
        );
    };

    handleOnProductOpen = () => this.updateAutocompleteVisible(false);

    handleClearSearch = () => {
        this.searchRef.current.focus();
        this.updateAutocompleteVisible(false);
        this.updateSearchState('');
    };

    render() {
        const { classes, isOpen } = this.props;

        const {
            searchQuery,
            autocompleteQuery,
            autocompleteVisible
        } = this.state;

        const searchClass = isOpen
            ? classes.searchBlockOpen
            : classes.searchBlock;

        const clearClass = searchQuery
            ? classes.clearIconOpen
            : classes.clearIcon;

        return (
            <div className={searchClass}>
                <div className={classes.searchInner}>
                    <button
                        className={classes.searchIcon}
                        onClick={this.handleSearchSubmit}
                    >
                        <Icon name="search" />
                    </button>
                    <input
                        ref={this.searchRef}
                        value={searchQuery}
                        className={classes.searchBar}
                        onFocus={this.updateAutocompleteVisible}
                        inputMode="search"
                        type="search"
                        placeholder="I'm looking for..."
                        onChange={this.handleOnChange}
                        onKeyDown={this.handleOnKeyDown}
                    />
                    <button
                        className={clearClass}
                        onClick={this.handleClearSearch}
                    >
                        <Icon name="x" />
                    </button>
                    <div
                        className={classes.autocompleteWrapper}
                        ref={this.autocompleteRef}
                    >
                        <SearchAutocomplete
                            handleOnProductOpen={this.handleOnProductOpen}
                            autocompleteVisible={autocompleteVisible}
                            handleCategorySearch={this.handleCategorySearch}
                            autocompleteQuery={autocompleteQuery}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    executeSearch: (query, history, id) =>
        dispatch(executeSearch(query, history, id))
});

export default compose(
    classify(defaultClasses),
    withRouter,
    connect(
        null,
        mapDispatchToProps
    )
)(SearchBar);
