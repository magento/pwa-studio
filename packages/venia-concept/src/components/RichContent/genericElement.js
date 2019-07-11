import React from 'react';

const GenericElement = ({
    data: {
        element: { domAttributes, children: elementChildren, tagName: Tag }
    },
    children
}) => {
    const tagChildren = elementChildren.map((element, i) =>
        typeof element === 'string' ? (
            element
        ) : (
            <GenericElement key={i} data={{ element }} />
        )
    );
    const allChildren = [...tagChildren, ...React.Children.toArray(children)];
    return <Tag {...domAttributes}>{allChildren}</Tag>;
};

export default GenericElement;
