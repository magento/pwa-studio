import React from 'react';
import Missing from './missing';
import { contentTypesConfig } from './config';

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

        return (
            <PageBuilderComponent {...data}>
                {data.children.map((childTreeItem, i) => (
                    <ContentTypeFactory key={i} data={childTreeItem} />
                ))}
            </PageBuilderComponent>
        );
    }

    return <Missing contentType={data.contentType} />;
};

export default ContentTypeFactory;
