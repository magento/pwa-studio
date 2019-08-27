import React from 'react';
import ContentTypeFactory from './factory';

/**
 * Page Builder component for rendering Page Builder master storage format in React
 *
 * @param data
 * @returns {*}
 * @constructor
 */
const PageBuilder = ({ data }) => {
    return data.children.map((child, i) => {
        return <ContentTypeFactory key={i} data={child} />;
    });
};

export default PageBuilder;
