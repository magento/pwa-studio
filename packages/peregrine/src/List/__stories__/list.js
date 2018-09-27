import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';

import List from '..';
import docs from '../__docs__/list.md';

const stories = storiesOf('List', module);

// simple example with string values
const simpleData = new Map()
    .set('s', 'Small')
    .set('m', 'Medium')
    .set('l', 'Large');

stories.add(
    'simple',
    withReadme(docs, () => (
        <List
            classes={{ root: 'foo' }}
            items={simpleData}
            render={'ul'}
            renderItem={'li'}
        />
    ))
);

// complex example with object values
const complexData = new Map()
    .set('s', { id: 's', value: 'Small' })
    .set('m', { id: 'm', value: 'Medium' })
    .set('l', { id: 'l', value: 'Large' });

stories.add(
    'complex',
    withReadme(docs, () => (
        <List
            classes={{ root: 'bar' }}
            items={complexData}
            render={props => <ul>{props.children}</ul>}
            renderItem={props => <li>{props.item.value}</li>}
        />
    ))
);
