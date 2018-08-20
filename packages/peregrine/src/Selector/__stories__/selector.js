import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';

import Selector from '..';
import docs from '../__docs__/selector.md';
import { paymentMethods, shippingMethods } from '../mock_data';

const stories = storiesOf('Selector', module);

// simple example with string values
const simpleData = new Map()
    .set('s', 'Small')
    .set('m', 'Medium')
    .set('l', 'Large');

stories.add(
    'simple',
    withReadme(docs, () => (
        <Selector
            options={paymentMethods}
            handleSelection={ (code) => { alert(code) }}
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
        <Selector
            options={paymentMethods}
        />
    ))
);
