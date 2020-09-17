import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PaymentMethod from '../paymentMethod';

const defaultProps = {
    data: [
        {
            type: 'Credit Card',
            additional_data: [
                {
                    name: 'card_type',
                    value: 'Visa'
                },
                {
                    name: 'last_four',
                    value: '1234'
                }
            ]
        }
    ]
};

test('should render properly', () => {
    const tree = createTestInstance(<PaymentMethod {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
