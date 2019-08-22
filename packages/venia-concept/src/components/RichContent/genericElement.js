import React from 'react';

const GenericElement = ({
    data: {
        element: { domAttributes, tagName: Tag }
    },
    children
}) => {
    if (!domAttributes.className.length) {
        delete domAttributes.className;
    } else {
        domAttributes.className = domAttributes.className.join(' ');
    }

    return <Tag {...domAttributes}>{children}</Tag>;
};

export default GenericElement;
