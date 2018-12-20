import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import Icon from 'src/components/Icon';
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
            searchBlock_open: PropTypes.string,
            searchBar: PropTypes.string,
            searchIcon: PropTypes.string
        }),
        executeSearch: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        isOpen: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.searchRef = React.createRef();
        this.state = { showClearIcon: false };
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
        const showClearIcon = query !== '';
        this.setState({ showClearIcon });
    }

    render() {
        const { classes, isOpen } = this.props;

        const searchClass = isOpen
            ? classes.searchBlock_open
            : classes.searchBlock;

        const clearIconClass = this.state.showClearIcon
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

export default classify(defaultClasses)(SearchBar);
