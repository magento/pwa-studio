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

    dismiss = () => this.setState({ showing: false });

    handleTransitionEnd = e => {
        const { afterDismiss } = this.props;
        // The transitionend event fires after slide down, but we only want to
        // run the afterDismiss callback after slide up.
        if (afterDismiss && !this.state.showing) {
            afterDismiss(e);
        }
    };

    handleClick = e => {
        this.props.onClick && this.props.onClick(e, this.dismiss);
    };

    state = {
        showing: false
    };

    componentDidMount() {
        // React sometimes optimizes by merging two successive DOM updates,
        // which means we don't get the transition effect. Therefore we wait a
        // moment after mount to add the class which causes the slide-down.
        this._showingTimeout = setTimeout(
            () => this.setState({ showing: true }),
            50
        );
    }

    componentWillUnmount() {
        // Don't leak timeouts! React will complain if the above timeout tries
        // to run setState on a component that isn't mounted anymore.
        clearTimeout(this._showingTimeout);
    }

    render() {
        const {
            classes,
            children,
            icon: IconGlyph,
            onClick,
            type
        } = this.props;
        const { showing } = this.state;
        const className = composeClassnames([
            classes.root,
            classes[type],
            onClick && classes.clickable,
            showing && classes.showing
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
