import React, { Suspense } from 'react';
import parseStorageHtml from './parseStorageHtml';
import Row from './row';
import Column from './column';
import ColumnGroup from './columnGroup';
import Container from './container';
import Image from './image';
import GenericElement from './genericElement';


const ContentTypes = {
    static: {
        row: Row,
        'column-group': ColumnGroup,
        column: Column,
        image: Image,
    },
    dynamic: {
        tabs: React.lazy(() => import('./tabs'))
    }
};


const walk = children =>
    children.map((child, i) => {
        return typeof child === 'string' ? (
            child
        ) : (
            <RichContent key={i} data={child} />
        );
    });

const RichContent = ({ data, html }) => {
    if (Array.isArray(data)) {
        return data.length ? walk(data) : null;
    } else if (typeof data === 'string') {
        // TODO - prevent this type check somehow
        return data;
    }

    const dataNode = data || parseStorageHtml(html);

    return dataNode.children.map((node, i) => {
        const StaticContentType = ContentTypes.static[node.contentType];

        if (StaticContentType) {
            console.log(`Found static content type for ${node.contentType}`, node);
            return (
                <StaticContentType key={i} {...node}>
                    <RichContent data={node.children}/>
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
                        <RichContent data={node.children}/>
                    </DynamicContentType>
                </Suspense>
            );
        }

        return null;

    });
};

export default RichContent;
