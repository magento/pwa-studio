import React, { Component } from 'react';
import { shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './block.css';

class Block extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        content: string.isRequired
    };

    render() {
        const { classes, content: __html } = this.props;

        return (
            <div
                className={classes.root}
                dangerouslySetInnerHTML={{ __html }}
            />
        );
    }
}

export default classify(defaultClasses)(Block);
