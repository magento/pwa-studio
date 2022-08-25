import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import ColumnGroup from '../columnGroup';

test('renders a ColumnGroup component', () => {
    const component = createTestInstance(<ColumnGroup />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a ColumnGroup component with all props configured', () => {
    const columnGroupProps = {
        display: 'flex'
    };
    const component = createTestInstance(<ColumnGroup {...columnGroupProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
