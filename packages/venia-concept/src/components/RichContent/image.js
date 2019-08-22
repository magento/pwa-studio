import React from 'react';
import imageClasses from './image.css';
import RichContent from './richContent';
import GenericElement from './genericElement';

const PageBuilderImage = ({ data }) => {
    // TODO - not desirable to alter state of data directly within our component
    data.elements.desktop_image[0].domAttributes.className.push(imageClasses['pagebuilder-mobile-hidden']);
    data.elements.mobile_image[0].domAttributes.className.push(imageClasses['pagebuilder-mobile-only']);

    return (
        <GenericElement data={ data }>
            <RichContent data={ data.children } />
        </GenericElement>
    );
};

export default PageBuilderImage;
