import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import uuid from 'uuid/v4';

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

    constructor(...args) {
        super(...args);

        this.timeoutId = null;
        this.uniqueId = uuid();
    }

    state = {
        isShowing: false
    };

    /*
     *  Close the tooltip on the next tick.
     *  Unfortunately this is necessary because another child of ours may have received focus
     *  and this blur event is fired before that new focus event.
     *  @see https://reactjs.org/docs/accessibility.html#mouse-and-pointer-events.
     */
    onBlur = () => {
        this.timeoutId = setTimeout(() => {
            this.setState({ isShowing: false });
        }, 0);
    };

    /*
     *  The tooltip target has received focus, show the tooltip.
     */
    onFocus = () => {
        // If a child receives focus, do not close the tooltip yet.
        clearTimeout(this.timeoutId);

        this.setState({ isShowing: true });
    };

    onKeyDown = event => {
        if (event.key === 'Escape') {
            this.setState({ isShowing: false });
        }
    };
    onMouseOver = () => {
        this.setState({ isShowing: true });
    };
    onMouseLeave = () => {
        this.setState({ isShowing: false });
    };

    render() {
        const { text, children, classes } = this.props;
        const { isShowing } = this.state;

        return (
            <div
                aria-describedBy={this.uniqueId}
                className={classes.root}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onKeyDown={this.onKeyDown}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
                tabIndex="1"
            >
                {isShowing && (
                    <div
                        className={classes.tooltip}
                        id={this.uniqueId}
                        role="tooltip"
                    >
                        {text}
                    </div>
                )}
                {children}
            </div>
        );
    }
}

export default classify(defaultClasses)(SwatchTooltip);
