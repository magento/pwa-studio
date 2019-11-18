import React from 'react';

import Article from '../../components/Article';
import Paragraph from '../../components/Paragraph';
import Section from '../../components/Section';
import content from './content.yml';

const Typography = () => (
    <Article title="Typography">
        <Paragraph>{content.page_description}</Paragraph>
        <Section fragment="Table-of-contents" title="Table of contents">
            Lorem ipsum
        </Section>
    </Article>
);

export default Typography;
