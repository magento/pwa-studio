import React, { useState } from 'react';
import { Image } from './Image';

export const ImageCarousel = ({
  images,
  productName,
  carouselIndex,
  setCarouselIndex,
}) => {
  const [swipeIndex, setSwipeIndex] = useState(0);

  const cirHandler = (index) => {
    setCarouselIndex(index);
  };

  const prevHandler = () => {
    if (carouselIndex === 0) {
      setCarouselIndex(0);
    } else {
      setCarouselIndex((prev) => prev - 1);
    }
  };

  const nextHandler = () => {
    if (carouselIndex === images.length - 1) {
      setCarouselIndex(0);
    } else {
      setCarouselIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="ds-sdk-product-image-carousel max-h-[250px] max-w-2xl m-auto">
      <div
        className="flex flex-nowrap overflow-hidden relative rounded-lg w-full h-full"
        onTouchStart={(e) => setSwipeIndex(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const endIndex = e.changedTouches[0].clientX;
          if (swipeIndex > endIndex) {
            nextHandler();
          } else if (swipeIndex < endIndex) {
            prevHandler();
          }
        }}
      >
        <div className="overflow-hidden relative max-w-[200px]">
          <div
            className={`flex transition ease-out duration-40`}
            style={{
              transform: `translateX(-${carouselIndex * 100}%)`,
            }}
          >
            {images.map((item, index) => {
              return (
                <Image
                  image={item}
                  carouselIndex={carouselIndex}
                  index={index}
                  key={index}
                  alt={productName}
                />
              );
            })}
          </div>
        </div>
      </div>
      {images.length > 1 && (
        <div className="absolute z-1 flex space-x-3 -translate-x-1/2 bottom-0 left-1/2 pb-2 ">
          {images.map((_item, index) => {
            return (
              <span
                key={index}
                style={
                  carouselIndex === index
                    ? {
                        width: `12px`,
                        height: `12px`,
                        borderRadius: `50%`,
                        border: `1px solid black`,
                        cursor: `pointer`,
                        backgroundColor: `#252525`,
                      }
                    : {
                        width: `12px`,
                        height: `12px`,
                        borderRadius: `50%`,
                        border: `1px solid silver`,
                        cursor: `pointer`,
                        backgroundColor: `silver`,
                      }
                }
                onClick={(e) => {
                  e.preventDefault();
                  cirHandler(index);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
