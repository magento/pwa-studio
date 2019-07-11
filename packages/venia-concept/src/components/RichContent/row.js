import React from 'react';
import GenericElement from './genericElement';

const Row = ({ data, children }) => {
    const inner = data.elements.inner[0];
    return (
        <GenericElement data={data}>
            <GenericElement data={{ element: inner }}>
                {children}
            </GenericElement>
        </GenericElement>
    );
};

export default Row;
