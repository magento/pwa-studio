import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import { toggleSearch } from 'src/actions/app';
import defaultClasses from './searchTrigger.css';

class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string,
            open: PropTypes.string
        }),
        toggleSearch: PropTypes.func.isRequired,
        searchOpen: PropTypes.bool
    };

    async componentDidMount() {
        if (document.location.pathname === '/search') {
            if (this.props.searchOpen !== true) {
                this.props.toggleSearch();
            }
        } else if (this.props.searchOpen === true) {
            this.props.toggleSearch();
        }
    }

    render() {
        const { children, classes, toggleSearch, searchOpen } = this.props;
        const searchClass = searchOpen ? classes.open : classes.root;

        return (
            <button className={searchClass} onClick={toggleSearch}>
                {children}
            </button>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    toggleSearch: () => dispatch(toggleSearch())
});

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(Trigger);
