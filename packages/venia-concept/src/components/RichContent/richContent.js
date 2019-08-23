import React from 'react';
import parseStorageHtml from './parseStorageHtml';

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

    return dataNode.children.map(node => {
        return (
            <div>
                <div>{node.contentType}</div>
                <div>
                    {node.children.map(child => {
                        return <div>{child.contentType}</div>;
                    })}
                </div>
            </div>
        );
    });
};

export default RichContent;
