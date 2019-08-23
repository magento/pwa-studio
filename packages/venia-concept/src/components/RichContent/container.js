import React from 'react';
import GenericElement from './genericElement';

const Container = ({ data, children }) => {
    return <GenericElement data={data}>{children}</GenericElement>;
};

export default Container;
