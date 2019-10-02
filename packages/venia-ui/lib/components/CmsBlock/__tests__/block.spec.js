import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Block from '../block';

jest.mock('../../RichContent', () => {
    return () => <div>RichContent</div>;
});

test('renders a Block component', () => {
    const component = createTestInstance(<Block />);

    expect(component.toJSON()).toMatchSnapshot();
});
