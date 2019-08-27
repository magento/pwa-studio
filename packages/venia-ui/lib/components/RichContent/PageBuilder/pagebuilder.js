import React from 'react';
import ContentTypeFactory from './factory';
import parseStorageHtml from './parseStorageHtml';

/**
 * Page Builder component for rendering Page Builder master storage format in React
 *
 * @param data
 * @returns {*}
 * @constructor
 */
const PageBuilder = ({ masterFormat }) => {
    const data = parseStorageHtml(masterFormat);
    return data.children.map((child, i) => {
        return <ContentTypeFactory key={i} data={child} />;
    });
};

export default PageBuilder;
