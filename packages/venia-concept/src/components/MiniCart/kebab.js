import React, { Component } from 'react';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './kebab.css';

class Kebab extends Component {
    render() {
        const { classes, isOpen, children, ...restProps } = this.props;
        const toggleClass = isOpen ? classes.dropdown_active : classes.dropdown;

        return (
            <div {...restProps} className={classes.root}>
                <button className={classes.kebab}>
                    <Icon
                        name="more-vertical"
                        attrs={{ color: 'rgb(var(--venia-teal))' }}
                    />
                </button>
                <ul className={toggleClass}>{children}</ul>
            </div>
        );
    }
}

export default classify(defaultClasses)(Kebab);
