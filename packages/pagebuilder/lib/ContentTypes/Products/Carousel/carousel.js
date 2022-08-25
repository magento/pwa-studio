import React from 'react';
import SlickSlider from 'react-slick';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import { useCarousel } from './useCarousel';

const Carousel = props => {
    const { settings, items } = props;

    const { storeConfig } = useCarousel();

    const galleryItems = items.map((item, index) => {
        return (
            <GalleryItem key={index} item={item} storeConfig={storeConfig} />
        );
    });

    return <SlickSlider {...settings}>{galleryItems}</SlickSlider>;
};

export default Carousel;
