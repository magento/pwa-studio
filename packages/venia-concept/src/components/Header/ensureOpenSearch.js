/**
 * @fileoverview This component is responsible for making sure search is open
 * when it mounts. If search is not open, it calls its `toggleSearch` prop to
 * toggle it to an open state.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

class EnsureOpenSearch extends Component {
    static propTypes = {
        searchOpen: PropTypes.bool,
        toggleSearch: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { searchOpen, toggleSearch } = this.props;
        if (searchOpen !== true) {
            toggleSearch();
        }
    }

    render() {
        // Purposefully do not render anything.
        return null;
    }
}

export default EnsureOpenSearch;
