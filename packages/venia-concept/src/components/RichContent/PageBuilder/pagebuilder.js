import React, { Suspense } from 'react';
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

            if (!contentTypeConfig.type) {
                return (
                    <PageBuilderComponent key={i} {...treeItem}>
                        <PageBuilder data={treeItem} />
                    </PageBuilderComponent>
                );
            } else if (
                contentTypeConfig.type &&
                contentTypeConfig.type === 'dynamic'
            ) {
                const fallback = html ? (
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                ) : null;

                return (
                    <Suspense fallback={fallback}>
                        <PageBuilderComponent key={i} {...treeItem}>
                            <PageBuilder data={treeItem} />
                        </PageBuilderComponent>
                    </Suspense>
                );
            }
        }

        return <Missing key={i} contentType={treeItem.contentType} />;
    });
};

export default PageBuilder;
