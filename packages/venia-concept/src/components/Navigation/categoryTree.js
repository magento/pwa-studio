import React, { Component, Fragment } from 'react';
import { func, number, objectOf, shape, string } from 'prop-types';

import { Query } from 'src/drivers';
import classify from 'src/classify';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import Branch from './categoryBranch';
import Leaf from './categoryLeaf';
import CategoryTree from './categoryTree';
import defaultClasses from './categoryTree.css';
import navigationMenu from '../../queries/getNavigationMenu.graphql';

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
        updateRootNodeId: func.isRequired,
        currentId: number.isRequired
    };

    get leaves() {
        const {
            classes,
            onNavigate,
            rootNodeId,
            updateRootNodeId,
            currentId
        } = this.props;

        return rootNodeId ? (
            <Query query={navigationMenu} variables={{ id: rootNodeId }}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return loadingIndicator;

                    const branches = [];

                    const children = data.category.children.sort((a, b) => {
                        if (a.position > b.position) return 1;
                        else if (a.position == b.position && a.id > b.id)
                            return 1;
                        else return -1;
                    });

                    const leaves = children.map(node => {
                        // allow leaf node to render if value is 1 or undefined (field not in Magento 2.3.0 schema)
                        if (node.include_in_menu === 0) {
                            return null;
                        }
                        const { children_count } = node;
                        const isLeaf = children_count == 0;
                        const elementProps = {
                            nodeId: node.id,
                            name: node.name,
                            urlPath: node.url_path,
                            path: node.path
                        };

                        if (!isLeaf) {
                            branches.push(
                                <CategoryTree
                                    key={node.id}
                                    rootNodeId={node.id}
                                    updateRootNodeId={updateRootNodeId}
                                    onNavigate={onNavigate}
                                    currentId={currentId}
                                />
                            );
                        }

                        const element = isLeaf ? (
                            <Leaf {...elementProps} onNavigate={onNavigate} />
                        ) : (
                            <Branch
                                {...elementProps}
                                onDive={updateRootNodeId}
                            />
                        );

                        return <li key={node.id}>{element}</li>;
                    });

                    const branchClass =
                        currentId == rootNodeId
                            ? classes.branch
                            : classes.inactive;

                    return (
                        <Fragment>
                            <div className={branchClass}>{leaves}</div>
                            {branches}
                        </Fragment>
                    );
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
