import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import CartCounter from '../cartCounter';

const classes = {
    root: 'a'
};

test('Cart counter is not rendered when numItems is not provided', () => {
    const component = createTestInstance(<CartCounter classes={classes} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart counter is not rendered when numItems is zero (0)', () => {
    const itemsQty = 0;

    const component = createTestInstance(
        <CartCounter numItems={itemsQty} classes={classes} />
    );

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart counter is rendered correctly when cart contains items', () => {
    const itemsQty = 1;

    const component = createTestInstance(
        <CartCounter numItems={itemsQty} classes={classes} />
    );

    expect(component.toJSON()).toMatchSnapshot();
});
