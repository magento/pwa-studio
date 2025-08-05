import React, { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../utils/useIntersectionObserver';

export const Image = ({
  image,
  alt,
  carouselIndex,
  index,
}) => {
  const imageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const entry = useIntersectionObserver(imageRef, { rootMargin: '200px' });

  useEffect(() => {
    if (!entry) return;

    if (entry?.isIntersecting && index === carouselIndex) {
      setIsVisible(true);
      setImageUrl(entry?.target?.dataset.src || '');
    }
  }, [entry, carouselIndex, index, image]);

  return (
    <img
      className={`aspect-auto w-100 h-auto ${isVisible ? 'visible' : 'invisible'}`}
      ref={imageRef}
      src={imageUrl}
      data-src={typeof image === 'object' ? image.src : image}
      srcSet={typeof image === 'object' ? image.srcset : null}
      alt={alt}
    />
  );
};
