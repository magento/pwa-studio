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

    return dataNode.children.map((node) => {
        return (
            <div>
                <div>{node.type}</div>
                <div>{node.children.map((child) => {
                    return (
                        <div>{child.type}</div>
                    )
                })}</div>
            </div>
        );
    })
};

export default RichContent;
