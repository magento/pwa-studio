import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './swatch.css';

class Swatch extends Component {
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
        const { id, name } = item;
        const style = { '--swatch-color': id };

        return (
            <button
                className={classes.root}
                title={name}
                style={style}
                onClick={this.handleClick}
            />
        );
    }

    handleClick = () => {
        console.log('clicked');
    };
}

export default classify(defaultClasses)(Swatch);
