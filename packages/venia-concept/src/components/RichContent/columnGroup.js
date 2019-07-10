import React from 'react';
import getContentNodeStyle from './getContentNodeStyle';

const ColumnGroup = props => {
    return <div style={getContentNodeStyle(props)}>{props.children}</div>;
};

export default ColumnGroup;
