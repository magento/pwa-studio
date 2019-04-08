import React, { Component } from 'react';
import { arrayOf, node, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from './button';
import defaultClasses from './buttonGroup.css';

class ButtonGroup extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }).isRequired,
        items: arrayOf(
            shape({
                children: node.isRequired,
                key: string.isRequired
            })
        ).isRequired
    };

    static defaultProps = {
        items: []
    };

    render() {
        const { classes, items } = this.props;

        const children = Array.from(items, ({ key, ...itemProps }) => (
            <Button key={key} {...itemProps} />
        ));

        return <div className={classes.root}>{children}</div>;
    }
}

export default classify(defaultClasses)(ButtonGroup);
