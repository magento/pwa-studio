import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { resourceUrl } from 'src/drivers';

import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { transparentPlaceholder } from 'src/shared/images';


import Zoom from "./zoom";
import Slider from "react-slick";
import "./react-slick.css";



class Carousel extends Component {



    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            currentImage: PropTypes.string,
            imageContainer: PropTypes.string,
            'chevron-left': PropTypes.string,
            'chevron-right': PropTypes.string
        }),
        images: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                position: PropTypes.number,
                disabled: PropTypes.bool,
                file: PropTypes.string.isRequired
            })
        ).isRequired
    };

    state = {
        activeItemIndex: 0
    };

    updateActiveItemIndex = index => {
        this.setState({ activeItemIndex: index });
        this.slider.slickGoTo(index);
    };

    // The spec does not guarantee a position parameter,
    // so the rule will be to order items without position last.
    // See https://github.com/magento/graphql-ce/issues/113.
    // Memoize this expensive operation based on reference equality
    // of the `images` array. Apollo cache should return a new array
    // only when it does a new fetch.
    sortAndFilterImages = memoize(items =>
        items
            .filter(i => !i.disabled)
            .sort((a, b) => {
                const aPos = isNaN(a.position) ? 9999 : a.position;
                const bPos = isNaN(b.position) ? 9999 : b.position;
                return aPos - bPos;
            })
    );

    get sortedImages() {
        const { images } = this.props;
        return this.sortAndFilterImages(images);
    }


    render() {
        const slickSettings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            afterChange: current => this.setState({ activeItemIndex: current })
        };

        const { classes } = this.props;

        const sortedImages = this.sortedImages;


        return (
            <div className={classes.root}>
                <div className={classes.imageContainer}>
                    <div className={classes.ZoomGallery}>
                        <Slider {...slickSettings} ref={slider => (this.slider = slider)} >
                            {this.sortedImages.map((slide, index) => (
                                <Zoom
                                    item = {slide}
                                    data-index={index} key={index}
                                    transparentPlaceholder = {transparentPlaceholder}
                                    resourceUrl = {resourceUrl}
                                />
                            ))}
                        </Slider>
                    </div>
                </div>




                <ThumbnailList
                    items={sortedImages}
                    activeItemIndex={this.state.activeItemIndex}
                    updateActiveItemIndex={this.updateActiveItemIndex}
                />


            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
