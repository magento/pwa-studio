import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Missing from '../missing';

jest.mock('../../../../classify');

test('renders a Missing component', () => {
    const missingProps = {
        contentType: 'test-content-type'
    };
    const component = createTestInstance(<Missing {...missingProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
