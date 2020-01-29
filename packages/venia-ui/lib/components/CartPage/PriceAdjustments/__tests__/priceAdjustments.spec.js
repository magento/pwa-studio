import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PriceAdjustments from '../priceAdjustments';

jest.mock('../ShippingMethods/shippingMethods', () => 'ShippingMethods');

test('it renders Venia price adjustments', () => {
    // Act.
    const instance = createTestInstance(<PriceAdjustments />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
