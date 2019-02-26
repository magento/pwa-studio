import React, { Component } from 'react';
import { Link } from 'src/drivers';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './categoryLeaf.css';

const urlSuffix = '.html';

class Leaf extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            text: string
        }),
        name: string.isRequired,
        urlPath: string.isRequired,
        onNavigate: func
    };

    handleClick = () => {
        const { onNavigate } = this.props;

        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    };

    render() {
        const { classes, name, urlPath } = this.props;

        return (
            <Link
                className={classes.root}
                to={`/${urlPath}${urlSuffix}`}
                onClick={this.handleClick}
            >
                <span className={classes.text}>{name}</span>
            </Link>
        );
    }
}

export default classify(defaultClasses)(Leaf);
