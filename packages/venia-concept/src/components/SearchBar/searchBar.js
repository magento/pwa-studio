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
        this.autocompleteRef = React.createRef();
        this.searchRef = React.createRef();
        this.clearRef = React.createRef();
    }
    state = {
        searchQuery: '',
        autocompleteVisible: false
    };

    toggleAutocompleteVisible = visible => {
        this.setState({
            autocompleteVisible: visible
        });
    };

    async componentDidMount() {
        if (this.props.isOpen) {
            this.setState({ autocompleteVisible: true });
        }
        if (document.location.pathname === '/search.html') {
            const params = new URL(document.location).searchParams;
            this.searchRef.current.value = params.get('query');
            this.setState({ searchQuery: params.get('query') });
            this.setClearIcon(this.searchRef.current.value);
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

    handleAutocompleteClick = e => {
        if (this.autocompleteRef.current.contains(e.target)) return;
        this.toggleAutocompleteVisible(false);
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen !== prevProps.isOpen) {
            if (this.props.isOpen == true) {
                this.searchRef.current.focus();
                this.toggleAutocompleteVisible(false);
            } else {
                this.searchRef.current.blur();
                this.toggleAutocompleteVisible(false);
            }
        }
    }

    enterSearch = event => {
        const searchQuery = this.searchRef.current.value;
        this.setState({ searchQuery: searchQuery });
        this.setClearIcon(searchQuery);
        if (
            (event.type === 'click' || event.key === 'Enter') &&
            searchQuery !== ''
        ) {
            this.toggleAutocompleteVisible(false);
            this.props.executeSearch(searchQuery, this.props.history);
        } else {
            this.toggleAutocompleteVisible(true);
        }
    };

    handleCategorySearch = event => {
        event.preventDefault();
        const { searchQuery } = this.state;
        const { id } = event.currentTarget.dataset || event.srcElement.dataset;
        this.toggleAutocompleteVisible(false);
        this.props.executeSearch(searchQuery, this.props.history, id);
    };

    clearSearch = () => {
        this.searchRef.current.value = '';
        this.searchRef.current.focus();
        this.setClearIcon(this.searchRef.current.value);
        this.setState({ searchQuery: '' });
    };

    setClearIcon(query) {
        if (query !== '') {
            this.clearRef.current.style.visiblity = 'visible';
            this.clearRef.current.style.opacity = '1';
            this.clearRef.current.style.cursor = 'pointer';
        } else {
            this.clearRef.current.style.visiblity = 'hidden';
            this.clearRef.current.style.opacity = '0';
            this.clearRef.current.style.cursor = 'auto';
        }
    }

    render() {
        const { classes, isOpen } = this.props;
        const { searchQuery } = this.state;
        const { handleCategorySearch } = this;

        const searchClass = isOpen
            ? classes.searchBlockOpen
            : classes.searchBlock;

        return (
            <div ref={this.autocompleteRef} className={searchClass}>
                <button
                    className={classes.searchIcon}
                    onClick={this.enterSearch}
                >
                    <Icon name="search" />
                </button>
                <input
                    ref={this.searchRef}
                    className={classes.searchBar}
                    onFocus={() => this.toggleAutocompleteVisible(true)}
                    inputMode="search"
                    type="search"
                    placeholder="I'm looking for..."
                    onKeyUp={this.enterSearch}
                />
                <button
                    ref={this.clearRef}
                    className={classes.clearIcon}
                    onClick={this.clearSearch}
                >
                    <Icon name="x" />
                </button>
                <SearchAutocomplete
                    autocompleteVisible={this.state.autocompleteVisible}
                    handleCategorySearch={handleCategorySearch}
                    searchQuery={searchQuery}
                />
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
