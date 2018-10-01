import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

class Tile extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        item: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        })
    };

    render() {
        const { classes, item } = this.props;
        const { name } = item;

        return (
            <button
                className={classes.root}
                title={name}
                onClick={this.handleClick}
            >
                <span>{name}</span>
            </button>
        );
    }

    handleClick = () => {
        console.log('clicked');
    };
}

export default classify(defaultClasses)(Tile);
