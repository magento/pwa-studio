import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import navigationMenu from '../../queries/getNavigationMenu.graphql';
import classify from 'src/classify';
import defaultClasses from './categoryLeaf.css';

const urlSuffix = '.html';

class CategoryMenu extends Component {
    render() {
        const { classes, id, currentId } = this.props;
        const menuClass = id == currentId ? '' : classes.inactive;

        return id ? (
            <Query query={navigationMenu} variables={{ id }}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return null;

                    const parentId = data.category.id;
                    const nodes = [];
                    const branches = [];
                    for (const child of data.category.children) {
                        nodes.push({
                            id: child.id,
                            name: child.name,
                            urlPath: child.url_path,
                            childrenCount: child.children_count,
                            position: child.position,
                            parentId: parentId
                        });
                        if (child.children_count != 0) {
                            branches.push(
                                <CategoryMenu
                                    key={child.id}
                                    id={child.id}
                                    currentId={currentId}
                                    classes={classes}
                                    onNavigate={this.props.onNavigate}
                                    setRootNodeId={this.props.setRootNodeId}
                                />
                            );
                        }
                    }
                    nodes.sort((a, b) => {
                        if (a.position > b.position) return 1;
                        else return -1;
                    });

                    const menu = nodes.map(node => {
                        return node.childrenCount == 0 ? (
                            <Link
                                key={node.id}
                                className={classes.root}
                                to={`/${node.urlPath}${urlSuffix}`}
                                onClick={this.handleClick}
                            >
                                <span className={classes.text}>
                                    {node.name}
                                </span>
                            </Link>
                        ) : (
                            <button
                                key={node.id}
                                className={classes.root}
                                onClick={() =>
                                    this.dive(node.id, node.parentId)
                                }
                            >
                                <span className={classes.text}>
                                    {node.name}
                                </span>
                            </button>
                        );
                    });
                    return (
                        <div>
                            <div className={menuClass}>{menu}</div>
                            {branches}
                        </div>
                    );
                }}
            </Query>
        ) : null;
    }

    handleClick = () => {
        const { onNavigate } = this.props;

        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    };

    dive = (targetId, parentId) => {
        this.props.setRootNodeId(targetId);
        this.props.setParentId(parentId);
    };
}

export default classify(defaultClasses)(CategoryMenu);
