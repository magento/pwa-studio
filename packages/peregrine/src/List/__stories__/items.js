import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';

import Items from '..';
import docs from '../__docs__/items.md';

const data = {
    s: { id: 's', value: 'Small' },
    m: { id: 'm', value: 'Medium' },
    l: { id: 'l', value: 'Large' }
};

const stories = storiesOf('Items', module);

stories.add(
    'default',
    withReadme(docs, () => <Items items={Object.entries(data)} />)
);
