import React, { Component } from 'react';
import { func, number, object, oneOfType, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './icon.css';

/**
 * The Icon component allows us to wrap each icon with some default styling.
 */
class Icon extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        size: number,
        attrs: object,
        src: oneOfType([func, shape({ render: func.isRequired })]).isRequired
    };

    render() {
        const {
            attrs: { width, ...restAttrs } = {},
            size,
            classes,
            src: IconComponent
        } = this.props;

        // Permit both prop styles:
        // <Icon src={Foo} attrs={{ width: 18 }} />
        // <Icon src={Foo} size={18} />
        return (
            <span className={classes.root}>
                <IconComponent size={size || width} {...restAttrs} />
            </span>
        );
    }
}

export default classify(defaultClasses)(Icon);
