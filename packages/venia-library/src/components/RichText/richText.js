import React, { Component } from 'react';

import classify from 'src/classify';
import defaultClasses from './richText.css';

const toHTML = str => ({ __html: str });

class RichText extends Component {
    render() {
        const { classes, content } = this.props;

        return (
            <div
                className={classes.root}
                dangerouslySetInnerHTML={toHTML(content)}
            />
        );
    }
}

export default classify(defaultClasses)(RichText);
