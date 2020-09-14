import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ShippingInformation from '../shippingInformation';

const defaultProps = {
    data: {
        city: 'Austin',
        country_code: 'US',
        firstname: 'Gooseton',
        lastname: 'Jr',
        postcode: '78759',
        region_id: 'TX',
        street: 'Goose Dr',
        telephone: '9123456789'
    }
};

test('should render properly', () => {
    const tree = createTestInstance(<ShippingInformation {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
