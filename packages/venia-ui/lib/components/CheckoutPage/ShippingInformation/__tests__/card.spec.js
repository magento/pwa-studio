import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Card from '../card';

jest.mock('../../../../classify');

const shippingData = {
    city: 'Manhattan',
    country: { label: 'USA' },
    email: 'fry@planet.express',
    firstname: 'Philip',
    lastname: 'Fry',
    postcode: '10019',
    region: { region: 'New York' },
    street: ['3000 57th Street', 'Suite 200'],
    telephone: '(123) 456-7890'
};

test('renders card with data', () => {
    const tree = createTestInstance(<Card shippingData={shippingData} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
