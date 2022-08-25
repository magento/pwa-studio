import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Block from '../block';

jest.mock('../../RichContent', () => props => <mock-RichContent {...props} />);

test('renders a Block component', () => {
    const component = createTestInstance(<Block />);

    expect(component.toJSON()).toMatchSnapshot();
});
