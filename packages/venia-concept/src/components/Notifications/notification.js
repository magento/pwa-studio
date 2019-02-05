import React, { Component } from 'react';
import Icon from 'src/components/Icon';
import { any, func, oneOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './notification.css';

// To properly handle transitions, we must compose classnames manually rather
// than relying on the CSS `composes` keyword. We have to add classes
// individually during re-renders.
const composeClassnames = classNames => classNames.filter(s => s).join(' ');

class Notification extends Component {
    static propTypes = {
        children: any.isRequired,
        classes: shape({
            root: string
        }),
        icon: any.isRequired,
        afterDismiss: func,
        onClick: func,
        type: oneOf(['error', 'success', 'warning']).isRequired
    };

    dismiss = () => this.setState({ dismissing: true, showing: false });

    handleTransitionEnd = e => {
        const { afterDismiss } = this.props;
        if (afterDismiss && this.state.dismissing) {
            afterDismiss(e);
        }
    };

    handleClick = e =>
        this.props.onClick && this.props.onClick(e, this.dismiss);

    state = {
        dismissing: false,
        showing: false
    };

    componentDidMount() {
        this.setState({ showing: true });
    }

    render() {
        const {
            classes,
            children,
            icon: IconGlyph,
            onClick,
            type
        } = this.props;
        const { dismissing, showing } = this.state;
        const className = composeClassnames([
            classes.root,
            classes[type],
            dismissing && classes.dismissing,
            showing && classes.showing,
            onClick && classes.clickable
        ]);

        return (
            <button
                className={className}
                onTransitionEnd={this.handleTransitionEnd}
                onClick={this.handleClick}
            >
                <Icon src={IconGlyph} />
                <div className={classes.message}>{children}</div>
            </button>
        );
    }
}

export default classify(defaultClasses)(Notification);
