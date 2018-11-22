import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import SearchAutocomplete from './autocomplete';
import classify from 'src/classify';
import { executeSearch } from 'src/actions/app';
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

        this.state = {
            searchQuery: '',
            autocompleteVisible: false
        };

        this.autocompleteRef = React.createRef();
        this.searchRef = React.createRef();
    }

    async componentDidMount() {
        if (document.location.pathname === '/search.html') {
            const params = new URL(document.location).searchParams;
            this.setState({ searchQuery: params.get('query') });
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
        this.setState({ searchQuery: value });
    };

    handleOnKeyDown = event => {
        const { value } = event.currentTarget || event.srcElement;
        if (event.key === 'Enter' && value !== '') {
            this.updateAutocompleteVisible(false);
            this.props.executeSearch(value, this.props.history);
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
        this.setState({ searchQuery: '' });
    };

    render() {
        const { classes, isOpen } = this.props;

        const { searchQuery, autocompleteVisible } = this.state;

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
                            searchQuery={searchQuery}
                            autocompleteVisible={autocompleteVisible}
                            handleOnProductOpen={this.handleOnProductOpen}
                            handleCategorySearch={this.handleCategorySearch}
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
