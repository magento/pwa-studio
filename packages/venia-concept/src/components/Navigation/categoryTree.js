import React, { Component } from 'react';
import { func, number, objectOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import Branch from './categoryBranch';
import Leaf from './categoryLeaf';
import defaultClasses from './categoryTree.css';

class Tree extends Component {
    static propTypes = {
        classes: shape({
            leaf: string,
            root: string,
            tree: string
        }),
        nodes: objectOf(
            shape({
                id: number.isRequired,
                position: number.isRequired
            })
        ),
        onNavigate: func,
        rootNodeId: number.isRequired,
        updateRootNodeId: func.isRequired
    };

    get leaves() {
        const { nodes, onNavigate, rootNodeId, updateRootNodeId } = this.props;
        const { childrenData: childNodeIds } = nodes[rootNodeId];

        const leaves = childNodeIds.reduce((elements, id) => {
            const childNode = nodes[id];
            const { childrenData, position } = childNode;
            const isLeaf = !childrenData.length;
            const elementProps = { nodeId: id, nodes };

            const element = isLeaf ? (
                <Leaf {...elementProps} onNavigate={onNavigate} />
            ) : (
                <Branch {...elementProps} onDive={updateRootNodeId} />
            );

            elements[position - 1] = <li key={id}>{element}</li>;

            return elements;
        }, []);

        if (nodes[rootNodeId].urlPath) {
            leaves.push(
                <li key={rootNodeId}>
                    <Leaf
                        nodeId={rootNodeId}
                        nodes={nodes}
                        onNavigate={onNavigate}
                    >
                        {({ node }) => `All ${node.name}`}
                    </Leaf>
                </li>
            );
        }

        return leaves;
    }

    render() {
        const { leaves, props } = this;
        const { classes } = props;

        return (
            <div className={classes.root}>
                <ul className={classes.tree}>{leaves}</ul>
            </div>
        );
    }
}

export default classify(defaultClasses)(Tree);
