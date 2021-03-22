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
            },
            {
                id: '2',
                tracking: [
                    {
                        number: 'USPS8645'
                    },
                    {
                        number: 'UPS0001'
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

test('should render placeholder text without shipments', () => {
    const tree = createTestInstance(
        <ShippingMethod data={{ shipments: [] }} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
