import React, { Suspense } from 'react';
import { contentTypesConfig } from './config';

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
    if (data.isHidden) {
        return null;
    }
    delete data.isHidden;

    const contentTypeConfig = contentTypesConfig[data.contentType];
    if (contentTypeConfig && contentTypeConfig.component) {
        return (
            <Suspense fallback={''}>
                {renderContentType(contentTypeConfig.component, data)}
            </Suspense>
        );
    }

    return null;
};

export default ContentTypeFactory;
