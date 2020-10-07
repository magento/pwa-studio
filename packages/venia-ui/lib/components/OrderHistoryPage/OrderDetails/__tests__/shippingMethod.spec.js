import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ShippingMethod from '../shippingMethod';

jest.mock('react-intl', () => ({
    FormattedMessage: props => (
        <div componentName="Formatted Message Component" {...props} />
    )
}));

const defaultProps = {
    data: {
        shipments: [
            {
                id: '1',
                tracking: [
                    {
                        carrier: 'Fedex',
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
