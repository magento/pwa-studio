import React from 'react';

const Leaf = props => {
    const { id, label } = props;

    return <a href={`/page/${id}`}>{label}</a>;
};

export default Leaf;
