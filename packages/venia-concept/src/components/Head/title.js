import React from 'react';
import { Title as _Title } from 'react-head';

export default props => (
    <_Title {...props} data-synthetictag>
        {props.children}
    </_Title>
);
