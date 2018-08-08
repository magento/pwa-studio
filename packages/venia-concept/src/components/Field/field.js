import { Component, Fragment, createElement } from 'react';
import PropTypes from 'prop-types';

class Field extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            label: PropTypes.string,
            message: PropTypes.string,
            root: PropTypes.string
        }),
        label: PropTypes.node,
        message: PropTypes.node,
        singular: PropTypes.bool
    };

    static defaultProps = {
        classes: {}
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
        const { classes, singular } = props;
        const elementType = singular ? 'label' : 'div';
        const elementProps = { className: classes.root };

        return createElement(elementType, elementProps, children);
    }
}

export default Field;
