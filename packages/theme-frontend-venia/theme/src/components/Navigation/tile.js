import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

class Tile extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            image: PropTypes.string,
            label: PropTypes.string,
            root: PropTypes.string
        })
    };

    render() {
        const { classes, text } = this.props;

        return (
            <span className={classes.root}>
                <span className={classes.image} />
                <span className={classes.label}>{text}</span>
            </span>
        );
    }
}

export default classify(defaultClasses)(Tile);
