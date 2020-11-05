import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ShippingMethod from '../shippingMethod';

const defaultProps = {
    data: {
        shipments: [
            {
                id: '1',
                tracking: [
                    {
                        number: 'FEDEX5885541235452125'
                    }
                ]
            }
        ],
        shipping_method: 'Free'
    }
};

test('should render properly', () => {
    const tree = createTestInstance(<ShippingMethod {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
