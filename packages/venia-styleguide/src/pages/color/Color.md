import Article from "../../components/Article"
import Section from "../../components/Section"
import TableOfContents from "../../components/TableOfContents"

import BrandColors from "./sections/BrandColors"
import Grays from "./sections/Grays"
import SemanticColors from "./sections/SemanticColors"

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
<Section title="Grays">
    <Grays />
</Section>
<Section title="Brand colors">
    <BrandColors />
</Section>
<Section title="Semantic colors">
    <SemanticColors />
</Section>

export const title = "Color"
export default Article
