import Article from "../../components/Article"
import Section from "../../components/Section"
import TableOfContents from "../../components/TableOfContents"

import FontSizes from "./sections/FontSizes"
import Formatting from "./sections/Formatting"
import Hierarchy from "./sections/Hierarchy"
import Typefaces from "./sections/Typefaces"

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
quis euismod nisi. Morbi metus mauris, volutpat ac aliquet eget,
laoreet vel tortor. Pellentesque commodo tellus nibh, vitae
varius lectus pharetra in. Aliquam quis nisi ligula. Proin sit
amet mauris ac lacus efficitur varius eget in urna. Ut sagittis
feugiat ex et dictum. Nam ut tempor urna, at dapibus erat.
Aenean ac dui a tellus venenatis accumsan.

***

<Section title="Table of contents">
    <TableOfContents />
</Section>
<Section title="Typefaces">
    <Typefaces />
</Section>
<Section title="Hierarchy">
    <Hierarchy />
</Section>
<Section title="Font sizes">
    <FontSizes />
</Section>
<Section title="Formatting">
    <Formatting />
</Section>
<Section title="Usage guidelines" />

export const title = "Typography"
export default Article
