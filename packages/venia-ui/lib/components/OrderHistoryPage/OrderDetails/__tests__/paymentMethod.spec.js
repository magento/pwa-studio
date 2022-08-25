import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PaymentMethod from '../paymentMethod';

const defaultProps = {
    data: [{ name: 'Credit Card' }]
};

test('should render properly', () => {
    const tree = createTestInstance(<PaymentMethod {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
