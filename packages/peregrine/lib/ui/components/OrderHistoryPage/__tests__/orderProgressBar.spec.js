import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import OrderProgressBar from '../orderProgressBar';

jest.mock('../../../classify');

jest.mock('react-intl', () => ({
    FormattedMessage: props => (
        <div componentName="Formatted Message Component" {...props} />
    ),
    useIntl: jest.fn().mockReturnValue({
        formatMessage: jest.fn().mockImplementation(options => options.id)
    })
}));

test('it renders steps', () => {
    const tree = createTestInstance(
        <OrderProgressBar status={'Ready to ship'} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
