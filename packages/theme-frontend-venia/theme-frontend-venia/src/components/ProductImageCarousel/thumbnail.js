import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './thumbnail.css';

const uri =
    'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAQAAADIpIVQAAAADklEQVR42mNkgAJGIhgAALQABsHyMOcAAAAASUVORK5CYII=';

class Thumbnail extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <img
                    className={classes.image}
                    src={`data:image/png;base64,${uri}`}
                    alt="thumbnail"
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(Thumbnail);
