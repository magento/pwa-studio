import React, { Suspense } from 'react';
import Missing from './missing';
import { contentTypesConfig, Lazy } from './config';

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
    const contentTypeConfig = contentTypesConfig[data.contentType];

    if (contentTypeConfig) {
        const PageBuilderComponent = contentTypeConfig.component;

        // If we're lazy loading add some suspense
        if (contentTypeConfig.load === Lazy) {
            return (
                <Suspense fallback={'Loading...'}>
                    {renderContentType(PageBuilderComponent, data)}
                </Suspense>
            );
        }

        return renderContentType(PageBuilderComponent, data);
    }

    return <Missing contentType={data.contentType} />;
};

export default ContentTypeFactory;
