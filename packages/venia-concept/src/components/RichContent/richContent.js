import React, { Suspense } from 'react';
import parseStorageHtml from './parseStorageHtml';
import Missing from './PageBuilder/missing';
import {contentTypesConfig} from "./PageBuilder/config";

const RichContent = ({ data, html }) => {
    const dataNode = data || parseStorageHtml(html);

    return dataNode.children.map((node, i) => {
        const contentTypeConfig = contentTypesConfig[node.contentType];

        if (contentTypeConfig) {
            const PageBuilderComponent = contentTypeConfig.component;

            if (!contentTypeConfig.type) {
                return (
                    <PageBuilderComponent key={i} {...node}>
                        <RichContent data={node} />
                    </PageBuilderComponent>
                );
            } else if (contentTypeConfig.type && contentTypeConfig.type === 'dynamic') {
                const fallback = html ? (
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                ) : null;

                return (
                    <Suspense fallback={fallback}>
                        <PageBuilderComponent key={i} {...node}>
                            <RichContent data={node} />
                        </PageBuilderComponent>
                    </Suspense>
                );
            }
        }

        return <Missing key={i} contentType={node.contentType} />;
    });
};

export default RichContent;
