import React from 'react';

import Leaf from './Leaf';

const Branch = props => {
    const { items, label } = props;

    const leaves = Array.from(items, ({ id, label }) => (
        <li key={id}>
            <Leaf id={id} label={label} />
        </li>
    ));

    return (
        <div>
            <button type="button">{label}</button>
            <ul>{leaves}</ul>
        </div>
    );
};

export default Branch;
