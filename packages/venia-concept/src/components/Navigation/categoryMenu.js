import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classify from 'src/classify';
import defaultClasses from './categoryLeaf.css';

const urlSuffix = '.html';

class CategoryMenu extends Component {
    componentDidMount() {
        const { setParentId } = this.props;
        const ids = this.props.data.category.path.split('/');
        const parentId = ids[ids.length - 2];
        setParentId(parentId);
    }

    render() {
        const { classes, data } = this.props;
        const { children } = data.category;

        let nodes = [];
        for (const child of children) {
            nodes.push({
                id: child.id,
                name: child.name,
                urlPath: child.url_path,
                childrenCount: child.children_count,
                position: child.position
            });
        }
        nodes.sort((a, b) => {
            if (a.position > b.position) return 1;
            else return -1;
        });

        return nodes.map(node => {
            return node.childrenCount == 0 ? (
                <Link
                    key={node.id}
                    className={classes.root}
                    to={`/${node.urlPath}${urlSuffix}`}
                    onClick={this.handleClick}
                >
                    <span className={classes.text}>{node.name}</span>
                </Link>
            ) : (
                <button
                    key={node.id}
                    className={classes.root}
                    onClick={() => this.dive(node.id)}
                >
                    <span className={classes.text}>{node.name}</span>
                </button>
            );
        });
    }

    handleClick = () => {
        const { onNavigate } = this.props;

        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    };

    dive = categoryId => {
        const { setRootNodeId } = this.props;

        setRootNodeId(categoryId);
    };
}

export default classify(defaultClasses)(CategoryMenu);
