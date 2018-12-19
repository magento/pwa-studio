/**
 * @fileoverview This class calls the function with the search query from the URL.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { getSearchParams } from 'src/util/getSearchParams';

export class SeedSearchInput extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        callback: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { callback, location } = this.props;
        const { inputText } = getSearchParams(location);
        callback(inputText);
    }

    render() {
        // Purposefully do not render anything.
        return null;
    }
}

export default SeedSearchInput;
