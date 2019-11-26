import React from 'react';

import Article from '../../components/Article';
import Paragraph from '../../components/Paragraph';
import Section from '../../components/Section';
import TableOfContents from '../../components/TableOfContents';
import mapTitlesToFragments from '../../util/mapTitlesToFragments';
import sampleText from '../../util/sampleText';

import FallbackFonts from './FallbackFonts.md';
import TypeScale from './TypeScale.md';
import Typefaces from './Typefaces.md';

const sections = mapTitlesToFragments([
    'Table of contents',
    'Typefaces',
    'Character styles',
    'Line height',
    'Margins',
    'Semantic text formatting',
    'Non-semantic text formatting',
    'Type scale',
    'Fallback fonts',
    'Usage guidelines'
]);

const sampleSnippet = sampleText.slice(0, 320);

const Typography = () => {
    return (
        <Article title="Typography">
            <Paragraph>{sampleSnippet}</Paragraph>
            <Section {...sections.get('Table of contents')}>
                <TableOfContents sections={sections} />
            </Section>
            <Section {...sections.get('Typefaces')}>
                <Typefaces />
            </Section>
            <Section {...sections.get('Character styles')}>
                {sampleSnippet}
            </Section>
            <Section {...sections.get('Line height')}>{sampleSnippet}</Section>
            <Section {...sections.get('Margins')}>{sampleSnippet}</Section>
            <Section {...sections.get('Semantic text formatting')}>
                {sampleSnippet}
            </Section>
            <Section {...sections.get('Non-semantic text formatting')}>
                {sampleSnippet}
            </Section>
            <Section {...sections.get('Type scale')}>
                <TypeScale />
            </Section>
            <Section {...sections.get('Fallback fonts')}>
                <FallbackFonts />
            </Section>
            <Section {...sections.get('Usage guidelines')}>
                {sampleSnippet}
            </Section>
        </Article>
    );
};

export default Typography;
