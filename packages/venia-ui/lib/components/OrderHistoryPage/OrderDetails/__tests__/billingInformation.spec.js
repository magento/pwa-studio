import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import BillingInformation from '../billingInformation';

jest.mock('react-intl', () => ({
    FormattedMessage: props => (
        <div componentName="Formatted Message Component" {...props} />
    )
}));

const defaultData = {
    city: 'Austin',
    country_code: 'USA',
    firstname: 'Gooseton',
    lastname: 'Jr',
    postcode: '78451',
    region: 'TX',
    street: ['2134, Apt 123, Goose Drive']
};

test('should render properly', () => {
    const tree = createTestInstance(<BillingInformation data={defaultData} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
