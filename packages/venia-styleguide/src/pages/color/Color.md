import Article from "../../components/Article"
import Palette from "../../components/Palette"
import Section from "../../components/Section"
import TableOfContents from "../../components/TableOfContents"

import Grays from "./sections/Grays"
import data from "./colors.yml"

export const colors = data

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
quis euismod nisi. Morbi metus mauris, volutpat ac aliquet eget,
laoreet vel tortor. Pellentesque commodo tellus nibh, vitae
varius lectus pharetra in. Aliquam quis nisi ligula. Proin sit
amet mauris ac lacus efficitur varius eget in urna. Ut sagittis
feugiat ex et dictum. Nam ut tempor urna, at dapibus erat.
Aenean ac dui a tellus venenatis accumsan.

***

<Palette colors={colors} />
<Section title="Table of contents">
    <TableOfContents />
</Section>
<Section title="Grays">
    <Grays />
</Section>

export const title = "Color"
export default Article
