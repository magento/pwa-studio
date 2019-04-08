import React, { Component } from 'react';
import { shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './fieldIcons.css';

class FieldIcons extends Component {
    static propTypes = {
        classes: shape({
            after: string,
            before: string,
            root: string
        })
    };

    render() {
        const { after, before, children, classes } = this.props;

        const style = {
            '--iconsBefore': before ? 1 : 0,
            '--iconsAfter': after ? 1 : 0
        };

        return (
            <span className={classes.root} style={style}>
                <span className={classes.input}>{children}</span>
                <span className={classes.before}>{before}</span>
                <span className={classes.after}>{after}</span>
            </span>
        );
    }
}

export default classify(defaultClasses)(FieldIcons);
