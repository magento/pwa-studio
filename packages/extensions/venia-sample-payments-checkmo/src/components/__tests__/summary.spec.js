import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Summary from '../summary';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('react-intl', () => ({
    FormattedMessage: props => (
        <div componentName="Formatted Message Component" {...props} />
    )
}));
jest.mock('@magento/venia-ui/lib/components/LinkButton', () => props => (
    <mock-LinkButton {...props} />
));
jest.mock('@magento/venia-ui/lib/components/Icon', () => props => (
    <mock-Icon {...props} />
));

test('renders correctly', () => {
    // Arrange.
    const props = {
        onEdit: jest.fn().mockName('onEdit')
    };

    // Act.
    const tree = createTestInstance(<Summary {...props} />);

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});
