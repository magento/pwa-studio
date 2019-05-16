import React, { useState } from 'react';
import { shape, string } from 'prop-types';
import classify from 'src/classify';

import defaultClasses from './imageLazyLoader.css';

const ImageLazyLoader = ({ classes, alt, src, ...props }) => {
    const [isLoaded, setLoaded] = useState(false);

    return (
        <img
            {...props}
            className={`${classes.root} ${
                !!isLoaded ? classes.loaded : classes.loading
            }`}
            onLoad={() => setLoaded(true)}
            src={src}
            alt={alt}
        />
    );
};

ImageLazyLoader.propTypes = {
    classes: shape({
        loading: string,
        loaded: string
    }),
    alt: string,
    src: string.isRequired
};

export default classify(defaultClasses)(ImageLazyLoader);
