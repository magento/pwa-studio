import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';

const uri =
    'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAQAAADIpIVQAAAADklEQVR42mNkgAJGIhgAALQABsHyMOcAAAAASUVORK5CYII=';

class Carousel extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            currentImage: PropTypes.string,
            root: PropTypes.string
        }),
        images: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string
            })
        )
    };

    render() {
        const { classes, images } = this.props;

        return (
            <div className={classes.root}>
                <img
                    className={classes.currentImage}
                    src={`data:image/png;base64,${uri}`}
                    alt="product"
                />
                <ThumbnailList items={images} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
