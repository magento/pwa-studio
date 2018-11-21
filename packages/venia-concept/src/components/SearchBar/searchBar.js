import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

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
        this.searchRef = React.createRef();
        this.state = {isClearIcon: false};
    }

    async componentDidMount() {
        if (this.props.isOpen) {
            this.searchRef.current.focus();
        }
        if (this.props.location.pathname === '/search.html') {
            this.searchRef.current.value = this.props.location.search.substring(7);
            this.setClearIcon(this.searchRef.current.value);
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
                return {isClearIcon: true};
            });
        } else {
            this.setState(() => {
                return {isClearIcon: false};
            });
        }
    }

    render() {
        const { classes, isOpen } = this.props;

        const searchClass = isOpen
            ? classes.searchBlockOpen
            : classes.searchBlock;

        const clearIconClass = this.state.isClearIcon ? classes.clearIcon : classes.clearIcon_off;

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
                <button
                    className={clearIconClass}
                    onClick={this.clearSearch}
                >
                    <Icon name="x" />
                </button>
            </div>
        );
    }
}

export default withRouter(classify(defaultClasses)(SearchBar));
