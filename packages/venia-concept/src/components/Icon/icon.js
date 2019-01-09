import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './icon.css';

/**
 * The Icon component allows us to wrap each icon with some default styling.
 */
class Icon extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { attrs, classes, src: IconComponent } = this.props;

        return (
            <span className={classes.root}>
                <IconComponent
                    size={attrs && attrs.width}
                    color={attrs && attrs.color}
                />
            </span>
        );
    }
}

export default classify(defaultClasses)(Icon);
