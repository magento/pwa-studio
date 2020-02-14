import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { H1, H2, H3, H4, H5, H6 } from '../Heading';
import InlineCode from '../InlineCode';
import Paragraph from '../Paragraph';
import ThematicBreak from '../ThematicBreak';

const components = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    hr: ThematicBreak,
    inlineCode: InlineCode,
    p: Paragraph
};

const MDXAdapter = props => {
    const { children } = props;

    return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default MDXAdapter;
