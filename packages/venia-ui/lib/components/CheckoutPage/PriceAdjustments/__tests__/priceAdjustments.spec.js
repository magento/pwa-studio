import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PriceAdjustments from '../priceAdjustments';

jest.mock('../../../../classify');
jest.mock('../../../CartPage/PriceAdjustments/CouponCode', () => 'CouponCode');
jest.mock(
    '../../../CartPage/PriceAdjustments/giftCardSection',
    () => 'GiftCardSection'
);
jest.mock(
    '../../../CartPage/PriceAdjustments/GiftOptions',
    () => 'GiftOptions'
);
jest.mock('../../../Accordion');

test('renders price adjustments', () => {
    const tree = createTestInstance(
        <PriceAdjustments
            setPageIsUpdating={jest.fn().mockName('setIsPageUpdating')}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
