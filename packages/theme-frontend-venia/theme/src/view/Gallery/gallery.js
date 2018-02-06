import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import GalleryItems, { emptyData } from './items';

import './gallery.css';

class Gallery extends Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        const { data } = this.props;
        const hasData = Array.isArray(data) && data.length;
        const items = hasData ? data : emptyData;

        return (
            <div className="gallery">
                <div className="gallery-actions">
                    <button>Filter</button>
                    <button>Sort</button>
                </div>
                <div className="gallery-items">
                    <GalleryItems items={items} />
                </div>
                <div className="gallery-pagination">
                    <button>
                        <span>Show More</span>
                    </button>
                </div>
            </div>
        );
    }
}

export default Gallery;
