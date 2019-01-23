import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './filtersCurrent.css';

class FiltersCurrent extends Component {
    render() {
        const { chosenFilterOptions } = this.props;

        console.log('CHOSEN FILTERS', chosenFilterOptions);
        return <div />;
    }
}

export default classify(defaultClasses)(FiltersCurrent);
