/**
 * @fileoverview This class seeds the value of the given input ref with the
 * search query from the URL.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

export class SeedSearchInput extends Component {
    static propTypes = {
        // A React Router location.
        // @see https://reacttraining.com/react-router/core/api/location.
        location: PropTypes.object.isRequired,
        // This is a React ref to the search input element,
        searchRef: PropTypes.any.isRequired,
        setClearIcon: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { location, searchRef, setClearIcon } = this.props;

        let value = '';
        if (location.search) {
            const params = new URLSearchParams(location.search);
            value = params.get('query') || '';
        }

        // Set the value of the search input element to that of the search query.
        searchRef.current.value = value;

        // And update the icon.
        setClearIcon(value);
    }

    render() {
        // Purposefully do not render anything.
        return null;
    }
}

export default SeedSearchInput;
