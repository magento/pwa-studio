import React from 'react';
import getContentNodeStyle from './getContentNodeStyle';

const Column = props => {
    return <div style={getContentNodeStyle(props)}>{props.children}</div>;
};

export default Column;
