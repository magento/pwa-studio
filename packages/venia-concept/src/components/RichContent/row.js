import React from 'react';
import getContentNodeStyle from './getContentNodeStyle';

const Row = props => {
    const innerStyle = getContentNodeStyle(props.data.elements.inner[0]);
    return (
        <div className="pb-row">
            <div className="pb-row-inner" style={innerStyle}>
                >{props.children}
            </div>
        </div>
    );
};

export default Row;
