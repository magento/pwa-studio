import { Component, createElement } from 'react';
import { node, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './section.css';

class Section extends Component {
    static propTypes = {
        classes: shape({
            label: string,
            root: string,
            summary: string
        }),
        label: node
    };

    render() {
        const { children, classes, label } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.label}>
                    <span>{label}</span>
                </div>
                <div className={classes.summary}>{children}</div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Section);
