import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import GalleryItems, { emptyData } from './items';
import defaultClasses from './gallery.css';

class Gallery extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            actions: PropTypes.string,
            filters: PropTypes.string,
            items: PropTypes.string,
            pagination: PropTypes.string,
            root: PropTypes.string
        }),
        data: PropTypes.arrayOf(PropTypes.object)
    };

    static defaultProps = {
        data: emptyData
    };

    render() {
        const { classes, data } = this.props;
        const hasData = Array.isArray(data) && data.length;
        const items = hasData ? data : emptyData;

        return (
            <div className={classes.root}>
                <div className={classes.actions}>
                    <button className={classes.action}>
                        <span>Filter</span>
                    </button>
                    <button className={classes.action}>
                        <span>Sort</span>
                    </button>
                </div>
                <div className={classes.items}>
                    <GalleryItems items={items} />
                </div>
                <div className={classes.pagination}>
                    <button className={classes.action}>
                        <span>Show More</span>
                    </button>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Gallery);
