import React from 'react';
import Missing from './missing';
import { contentTypesConfig } from './config';

/**
 * Page Builder component for rendering Page Builder master storage format in React
 *
 * @param data
 * @returns {*}
 * @constructor
 */
const PageBuilder = ({ data }) => {
    const contentTypeConfig = contentTypesConfig[data.contentType];

    if (contentTypeConfig) {
        const PageBuilderComponent = contentTypeConfig.component;

        return (
            <PageBuilderComponent {...data}>
                {data.children.map((childTreeItem, i) => (
                    <PageBuilder key={i} data={childTreeItem} />
                ))}
            </PageBuilderComponent>
        );
    }

    return <Missing key={i} contentType={data.contentType} />;
};

export default PageBuilder;
