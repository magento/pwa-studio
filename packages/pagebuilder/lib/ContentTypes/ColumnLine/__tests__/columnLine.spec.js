import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import ColumnLine from '../columnLine';

test('renders a ColumnLine component', () => {
    const component = createTestInstance(<ColumnLine />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a ColumnLine component with all props configured', () => {
    const columnLineProps = {
        display: 'flex'
    };
    const component = createTestInstance(<ColumnLine {...columnLineProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
