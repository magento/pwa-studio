import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './swatchTooltip.css';

class SwatchTooltip extends Component {
    static propTypes = {
        classes: PropTypes.shape({}),
        tooltipText: PropTypes.string
    };

    render() {
        const { tooltipText, children, classes } = this.props;

        return (
            <div className={classes.root}>
                <span className={classes.tooltip}>{tooltipText}</span>
                {children}
            </div>
        );
    }
}

export default classify(defaultClasses)(SwatchTooltip);
