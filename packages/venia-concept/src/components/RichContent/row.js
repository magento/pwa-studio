import React from 'react';
import GenericElement from './genericElement';
import RichContent from './richContent';

const Row = ({ data }) => {
    const innerElement = data.elements.inner[0];

    const isParallaxEnabled = !!parseInt(innerElement.dataAttributes.enableParallax, 10);
    const parallaxSpeed = parseInt(innerElement.dataAttributes.parallaxSpeed, 10);

    if (isParallaxEnabled) {
        innerElement.domAttributes.className += ' jarallax';
        innerElement.domAttributes['data-jarallax'] = '';
    }

    return (
        <GenericElement data={data}>
            <GenericElement data={innerElement}>
                <RichContent data={innerElement.children} />
            </GenericElement>
        </GenericElement>
    );
};

export default Row;
