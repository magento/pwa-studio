import React from 'react';
import { Title as _Title } from 'react-head';

export default props => (
    <_Title {...props} data-synteticTag>
        {props.children}
    </_Title>
);
