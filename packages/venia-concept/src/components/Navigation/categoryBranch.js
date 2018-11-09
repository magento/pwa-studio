import React, { Component } from 'react';
import { arrayOf, func, number, objectOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './categoryLeaf.css';

class Branch extends Component {
    static propTypes = {
        children: func,
        classes: shape({
            root: string,
            text: string
        }),
        nodeId: number.isRequired,
        nodes: objectOf(
            shape({
                childrenData: arrayOf(number).isRequired,
                id: number.isRequired,
                name: string.isRequired,
                urlPath: string
            })
        ),
        onDive: func.isRequired
    };

    handleClick = () => {
        const { nodeId, onDive } = this.props;

        onDive(nodeId);
    };

    render() {
        const { children, classes, nodeId, nodes } = this.props;
        const node = nodes[nodeId];
        const text = children ? children({ node }) : node.name;

        return (
            <button className={classes.root} onClick={this.handleClick}>
                <span className={classes.text}>{text}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Branch);
