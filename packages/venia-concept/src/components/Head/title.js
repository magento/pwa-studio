import React from 'react';
import { Title as _Title } from 'react-head';

const Title = props => (
    <_Title {...props} data-synthetictag>
        {props.children}
    </_Title>
);

export default Title;
