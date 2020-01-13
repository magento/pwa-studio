import Article from '../../components/Article';
import Section from '../../components/Section';
import TableOfContents from '../../components/TableOfContents';

import About from './sections/About/index.md';
import Behaviors from './sections/Behaviors/index.md';

<About />
<Section title="Table of Contents">
    <TableOfContents />
</Section>
<Section title="Behaviors">
    <Behaviors />
</Section>

export const title = 'Drawer Footer';
export default Article;
