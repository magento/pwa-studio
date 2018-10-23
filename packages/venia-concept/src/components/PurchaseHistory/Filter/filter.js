import React, { Component } from 'react';
import { shape, string } from 'prop-types';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './filter.css';

class Filter extends Component {
    static propTypes = {
        classes: shape({
            root: string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.filterIconContainer}>
                    <Icon name="filter" />
                </div>
                <span>Filter by...</span>
            </div>
        );
    }
}

export default classify(defaultClasses)(Filter);
