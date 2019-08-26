import React, { Suspense } from 'react';
import parseStorageHtml from './parseStorageHtml';
import Row from './PageBuilder/ContentTypes/Row/row';
import Column from './PageBuilder/ContentTypes/Column/column';
import ColumnGroup from './PageBuilder/ContentTypes/ColumnGroup/columnGroup';
import Heading from "./PageBuilder/ContentTypes/Heading/heading";
import Image from "./PageBuilder/ContentTypes/Image/image";

// TODO move into configuration
const ContentTypes = {
    static: {
        row: Row,
        'column-group': ColumnGroup,
        heading: Heading,
        column: Column,
        image: Image
    },
    dynamic: {
        //tabs: React.lazy(() => import('./PageBuilder/ContentTypes/Tabs/tabs'))
    }
};

const RichContent = ({ data, html }) => {
    const dataNode = data || parseStorageHtml(html);

    return dataNode.children.map((node, i) => {
        const StaticContentType = ContentTypes.static[node.contentType];

        if (StaticContentType) {
            console.log(`Found static content type for ${node.contentType}`, node);
            return (
                <StaticContentType key={i} {...node}>
                    <RichContent data={node} />
                </StaticContentType>
            );
        }

        const DynamicContentType = ContentTypes.dynamic[node.contentType];

        if (DynamicContentType) {
            console.log(`Found dynamic content type for ${node.contentType}`, node);
            const fallback = html ? (
                <div dangerouslySetInnerHTML={{__html: html}}/>
            ) : null;

            return (
                <Suspense fallback={fallback}>
                    <DynamicContentType key={i} {...node}>
                        <RichContent data={node} />
                    </DynamicContentType>
                </Suspense>
            );
        }

        return null;

    });
};

export default RichContent;
