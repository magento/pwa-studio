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
    return data.children.map((treeItem, i) => {
        const contentTypeConfig = contentTypesConfig[treeItem.contentType];

        if (contentTypeConfig) {
            const PageBuilderComponent = contentTypeConfig.component;

            return (
                <PageBuilderComponent key={i} {...treeItem}>
                    <PageBuilder data={treeItem} />
                </PageBuilderComponent>
            );
        }

        return <Missing key={i} contentType={treeItem.contentType} />;
    });
};

export default PageBuilder;
