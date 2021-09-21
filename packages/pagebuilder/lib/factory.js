import React, { Suspense } from 'react';
import { getContentTypeConfig, setContentTypeConfig } from './config';
import customContentTypes from './ContentTypes/customContentTypes';

/**
 *  add custom content types
 */
const addCustomContentTypes = contentTypes => {
    for (const ContentType of contentTypes) {
        const { component, configAggregator } = ContentType;
        if (!ContentType.name) {
            ContentType.name = component.name;
        }
        if (ContentType.name && component && configAggregator) {
            setContentTypeConfig(ContentType.name, {
                component,
                configAggregator
            });
        }
    }
};

addCustomContentTypes(customContentTypes);

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
    const { isHidden, ...props } = data;

    if (isHidden) {
        return null;
    }

    const contentTypeConfig = getContentTypeConfig(props.contentType);
    if (contentTypeConfig && contentTypeConfig.component) {
        const Component = renderContentType(contentTypeConfig.component, props);
        const ComponentShimmer = contentTypeConfig.componentShimmer
            ? renderContentType(contentTypeConfig.componentShimmer, props)
            : '';

        return <Suspense fallback={ComponentShimmer}>{Component}</Suspense>;
    }

    return null;
};

export default ContentTypeFactory;
