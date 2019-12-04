import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { H3 } from '../Heading';
import Paragraph from '../Paragraph';
import ThematicBreak from '../ThematicBreak';

const components = {
    h3: H3,
    hr: ThematicBreak,
    p: Paragraph
};

const MDXAdapter = props => {
    const { children } = props;

    return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default MDXAdapter;
