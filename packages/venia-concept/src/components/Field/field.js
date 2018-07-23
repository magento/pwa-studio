import { Component, Fragment, createElement } from 'react';
import { bool, node, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './field.css';

class Field extends Component {
    static propTypes = {
        classes: shape({
            label: string,
            message: string,
            root: string
        }),
        group: bool,
        label: node,
        message: node
    };

    get children() {
        const { classes, children, label, message } = this.props;

        return (
            <Fragment>
                <span key={label} className={classes.label}>
                    {label}
                </span>
                {children}
                <p key={message} className={classes.message}>
                    {message}
                </p>
            </Fragment>
        );
    }

    render() {
        const { children, props } = this;
        const { classes, group } = props;
        const elementType = group ? 'div' : 'label';
        const elementProps = { className: classes.root };

        return createElement(elementType, elementProps, children);
    }
}

export default classify(defaultClasses)(Field);
