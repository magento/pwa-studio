import React from 'react';

const getDimensionStyle = (dimension) => {
    return typeof dimension === 'string' ? dimension : `${dimension}px`;
};

export default (props) => {
    const { width, height, className, style, ...restProps } = props;
    const styles = {
        ...style,
        width: width ? getDimensionStyle(width) : '100%',
        height: height ? getDimensionStyle(height) : 'auto',
        backgroundColor: 'rgb(244,245,245)'
    };

    return (
        <div
            {...restProps}
            className={className}
            style={styles}
        />
    );
};
