import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './categoryLeaf.css';

class Branch extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            text: string
        }),
        name: string.isRequired,
        path: string.isRequired,
        onDive: func.isRequired
    };

    handleClick = () => {
        const { path, onDive } = this.props;

        onDive(path);
    };

    render() {
        const { classes, name } = this.props;

        return (
            <button className={classes.root} onClick={this.handleClick}>
                <span className={classes.text}>{name}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Branch);
