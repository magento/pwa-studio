import React, { Suspense } from 'react';
import getContentTypeConfig, { MissingComponent } from './config';

/**
 * Render a content type
 *
 * @param Component
 * @param data
 * @returns {*}
 */
const renderContentType = (Component, data) => {
    return (
        <Component {...data}>
            {data.children.map((childTreeItem, i) => (
                <ContentTypeFactory key={i} data={childTreeItem} />
            ))}
        </Component>
    );
};

/**
 * Create an instance of a content type component based on configuration
 *
 * @param data
 * @returns {*}
 * @constructor
 */
const ContentTypeFactory = ({ data }) => {
    const contentTypeConfig = getContentTypeConfig(data.contentType);

    let children;
    if (contentTypeConfig && contentTypeConfig.component) {
        children = renderContentType(contentTypeConfig.component, data);
    } else {
        children = <MissingComponent contentType={data.contentType} />;
    }

    return <Suspense fallback={''}>{children}</Suspense>;
};

export default ContentTypeFactory;
