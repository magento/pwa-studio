import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PriceAdjustments from '../priceAdjustments';

jest.mock('../CouponCode/couponCode', () => 'CouponCode');
jest.mock('../../GiftCards/giftCards', () => 'GiftCards');

test('it renders Venia price adjustments', () => {
    // Act.
    const instance = createTestInstance(<PriceAdjustments />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
