import React from 'react';
import TestRenderer from 'react-test-renderer';

import DetailsBlock from '../detailsBlock';

jest.mock('src/classify');

const rows = [
    { property: 'Order No', value: '84322' },
    { property: 'Order Date', value: 'June 24, 2018' }
];

test('renders the expected tree', () => {
    const tree = TestRenderer.create(<DetailsBlock rows={rows} />);

    expect(tree).toMatchSnapshot();
});

test('renders elements with classnames', () => {
    const { root } = TestRenderer.create(<DetailsBlock rows={rows} />);

    expect(root.findByProps({ className: 'root' })).toBeTruthy();
    expect(root.findAllByProps({ className: 'property' })).toHaveLength(2);
    expect(root.findAllByProps({ className: 'value' })).toHaveLength(2);
});

test('renders data as children', () => {
    const { root } = TestRenderer.create(<DetailsBlock rows={rows} />);

    expect(root.findByProps({ children: rows[0].property })).toBeTruthy();
    expect(root.findByProps({ children: rows[0].value })).toBeTruthy();
    expect(root.findByProps({ children: rows[1].property })).toBeTruthy();
    expect(root.findByProps({ children: rows[1].value })).toBeTruthy();
});
