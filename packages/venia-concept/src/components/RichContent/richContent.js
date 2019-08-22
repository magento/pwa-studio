import React, { Suspense } from 'react';
import parseStorageHtml from './parseStorageHtml';
import Row from './row';
import Container from './container';
import Image from './image';
import GenericElement from './genericElement';

const ContentTypes = {
    static: {
        row: Row,
        column: Container,
        'column-group': Container,
        image: Image,
    },
    dynamic: {
        tabs: React.lazy(() => import('./tabs'))
    }
};

const walk = (children) => children.map((child, i) => {
    return typeof child === 'string' ? child : <RichContent key={i} data={child} />;
});

const RichContent = ({ data, html }) => {
    if (Array.isArray(data)) {
        return data.length ? walk(data) : null;
    } else if (typeof data === 'string') { // TODO - prevent this type check somehow
        return data;
    }

    const dataNode = data || parseStorageHtml(html);

    const StaticContentType = ContentTypes.static[dataNode.type];

    if (StaticContentType) {
        return (
            <StaticContentType data={dataNode}>
                {dataNode.children.length ? walk(dataNode.children) : null}
            </StaticContentType>
        );
    }

    const DynamicContentType = ContentTypes.dynamic[dataNode.type];

    if (DynamicContentType) {
        const fallback = html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : null;

        return (
            <Suspense fallback={fallback}>
                <DynamicContentType data={dataNode}>
                    {dataNode.children.length ? walk(dataNode.children) : null}
                </DynamicContentType>
            </Suspense>
        );
    }

    return (
        <GenericElement data={dataNode}>
            {dataNode.children.length ? walk(dataNode.children) : null}
        </GenericElement>
    );
};

export default RichContent;
