import React, { Component } from 'react';
import { shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './swatchTooltip.css';

class SwatchTooltip extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            tooltip: string
        }),
        text: string
    };

    render() {
        const { text, children, classes } = this.props;

        return (
            <div className={classes.root}>
                <span className={classes.tooltip}>{text}</span>
                {children}
            </div>
        );
    }
}

export default classify(defaultClasses)(SwatchTooltip);
