import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PaymentMethod from '../paymentMethod';

jest.mock('react-intl', () => ({
    FormattedMessage: props => (
        <div componentName="Formatted Message Component" {...props} />
    )
}));

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
