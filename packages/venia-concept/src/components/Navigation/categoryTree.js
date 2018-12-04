import React, { Component } from 'react';
import { func, number, objectOf, shape, string } from 'prop-types';
import { Query } from 'react-apollo';
import navigationMenu from '../../queries/getNavigationMenu.graphql';

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

        return rootNodeId ? (
            <Query query={navigationMenu} variables={{ id: rootNodeId }}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return null;
                    //const { childrenData: childNodeIds } = nodes[rootNodeId];
                    //const childNodeIds = data.category.children.map(({ id }) => id);
                    //console.log(childNodeIds);
                    //console.log(childNodeIds);
                    const children = data.category.children.sort((a, b) => {
                        if (a.position > b.position) return 1;
                        else return -1;
                    });
                    const leaves = children.map(node => {
                        const { children_count, position } = node;
                        const isLeaf = children_count == 0;
                        const elementProps = { nodeId: node.id, name: node.name, urlPath: node.url_path };
                        console.log(node.url_path);
                        const element = isLeaf ? (
                            <Leaf {...elementProps} onNavigate={onNavigate} />
                        ) : (
                            <Branch {...elementProps} onDive={updateRootNodeId} />
                        );

                        return <li key={node.id}>{element}</li>;
                    });

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
                }}
            </Query>
        ) : null;
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
