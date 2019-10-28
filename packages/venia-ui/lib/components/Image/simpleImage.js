import React from 'react';
import { string, func } from 'prop-types';

const SimpleImage = props => {
    const { className, handleError, handleLoad, src, ...rest } = props;

    return (
        <img
            className={className}
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
