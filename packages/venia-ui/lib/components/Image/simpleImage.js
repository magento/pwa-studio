import React from 'react';
import { string, func } from 'prop-types';

const SimpleImage = props => {
    const { className, handleError, handleLoad, src, ...rest } = props;

    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
            className={className}
            loading="lazy"
            onError={handleError}
            onLoad={handleLoad}
            src={src}
            {...rest}
        />
    );
};

SimpleImage.propTypes = {
    className: string,
    handleError: func,
    handleLoad: func,
    src: string.isRequired
};

export default SimpleImage;
