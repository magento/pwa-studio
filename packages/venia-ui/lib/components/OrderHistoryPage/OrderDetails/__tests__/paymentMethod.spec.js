import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PaymentMethod from '../paymentMethod';

const defaultProps = {
    data: [
        {
            type: 'Credit Card',
            additional_data: {
                card_type: 'Visa',
                last_four: '1234'
            }
        }
    ]
};

test('should render properly', () => {
    const tree = createTestInstance(<PaymentMethod {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
