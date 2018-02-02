/* eslint-disable */
import { Component, createElement } from 'react';

import './gallery.css';

const imagePlaceholder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAfCAQAAAC4ua71AAAAGklEQVR42mNkIBkwjmoZ1TKqZVTLqJYRpgUAaP0AIAQAObYAAAAASUVORK5CYII=';

const GalleryItemPlaceholder = () => (
    <div className="gallery-item" data-loaded={false}>
        <div className="gallery-item-image">
            <img width="300" height="372" src={imagePlaceholder} />
        </div>
        <div className="gallery-item-name" />
        <div className="gallery-item-price" />
    </div>
);

class GalleryItem extends Component {
    render() {
        const { item, showImage } = this.props;

        if (!item || !showImage) {
            return <GalleryItemPlaceholder />;
        }

        const { image, name, price } = item;

        return (
            <div className="gallery-item" data-loaded={true}>
                <div className="gallery-item-image">
                    <img src={image} />
                </div>
                <div className="gallery-item-name">
                    <span>{name}</span>
                </div>
                <div className="gallery-item-price">
                    <span>{price}</span>
                </div>
            </div>
        );
    }
}

const GalleryItems = ({ items, showImages }) =>
    items.map((item, index) => (
        <GalleryItem key={index} item={item} showImage={showImages} />
    ));

class Gallery extends Component {
    state = {
        imagesAreReady: false
    };

    componentDidMount() {
        // request images here, inside Promise.all()
        // const { data } = this.props;
        // data.map(({ image }) => fetch(image, { method: 'GET', cors: true }))
        Promise.resolve().then(() => {
            this.setState(() => ({
                imagesAreReady: true
            }));
        });
    }

    render() {
        const { data } = this.props;
        const { imagesAreReady } = this.state;

        return (
            <div className="gallery">
                <div className="gallery-actions">
                    <button>Filter</button>
                    <button>Sort</button>
                </div>
                <div className="gallery-items">
                    <GalleryItems items={data} showImages={imagesAreReady} />
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
