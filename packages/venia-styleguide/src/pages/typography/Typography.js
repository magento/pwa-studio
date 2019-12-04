import React from 'react';

import Article from '../../components/Article';
import Paragraph from '../../components/Paragraph';
import Section from '../../components/Section';
import TableOfContents from '../../components/TableOfContents';

import CharacterStyles from './sections/CharacterStyles';
import FallbackFonts from './sections/FallbackFonts';
import LineHeight from './sections/LineHeight';
import Margins from './sections/Margins';
import TypeScale from './sections/TypeScale';
import Typefaces from './sections/Typefaces';

const Typography = () => {
    return (
        <Article title="Typography">
            <Paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                quis euismod nisi. Morbi metus mauris, volutpat ac aliquet eget,
                laoreet vel tortor. Pellentesque commodo tellus nibh, vitae
                varius lectus pharetra in. Aliquam quis nisi ligula. Proin sit
                amet mauris ac lacus efficitur varius eget in urna. Ut sagittis
                feugiat ex et dictum. Nam ut tempor urna, at dapibus erat.
                Aenean ac dui a tellus venenatis accumsan.
            </Paragraph>
            <Section title="Table of contents">
                <TableOfContents />
            </Section>
            <Section title="Typefaces">
                <Typefaces />
            </Section>
            <Section title="Character styles">
                <CharacterStyles />
            </Section>
            <Section title="Line height">
                <LineHeight />
            </Section>
            <Section title="Margins">
                <Margins />
            </Section>
            <Section title="Semantic text formatting" />
            <Section title="Non-semantic text formatting" />
            <Section title="Type scale">
                <TypeScale />
            </Section>
            <Section title="Fallback fonts">
                <FallbackFonts />
            </Section>
            <Section title="Usage guidelines" />
        </Article>
    );
};

export default Typography;
