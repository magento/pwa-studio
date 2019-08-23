import React from 'react';

const Row = ({ minHeight, backgroundColor, children }) => {
    return (
        <div data-content-type="row" style={{minHeight: minHeight, backgroundColor: backgroundColor}}>
            {children}
        </div>
    );
};

export default Row;
