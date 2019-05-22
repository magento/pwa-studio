import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Trigger from '../trigger';

test('renders children inside of a button', () => {
    const props = {
        children: <span>Hi, I'm a child</span>
    };

    const tree = createTestInstance(<Trigger {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders a button with no children when children not supplied', () => {
    const props = {};

    const tree = createTestInstance(<Trigger {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
