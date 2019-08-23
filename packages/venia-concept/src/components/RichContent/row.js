import React from 'react';
import GenericElement from './genericElement';
import RichContent from './richContent';

const Row = ({ data, children }) => {
    return (
        <div>
            <div data-enable-parallax="0" data-parallax-speed="0.5">
                {children}
            </div>
        </div>
    );
};

export default Row;
