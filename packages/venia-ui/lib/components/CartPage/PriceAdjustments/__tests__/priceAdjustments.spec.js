import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PriceAdjustments from '../priceAdjustments';

jest.mock('../ShippingMethods', () => 'ShippingMethods');
jest.mock('../CouponCode', () => 'CouponCode');
jest.mock('../giftCardSection', () => 'GiftCardSection');
jest.mock('../GiftOptions', () => 'GiftOptions');

test('it renders Venia price adjustments', () => {
    // Act.
    const instance = createTestInstance(<PriceAdjustments />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
