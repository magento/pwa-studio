import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ProductOptions from '../productOptions';

const renderer = new ShallowRenderer();

test('it renders null when options are missing', () => {
    const tree = renderer.render(<ProductOptions />);

    expect(tree).toMatchSnapshot();
});

test('it renders null when options is empty', () => {
    const props = {
        options: []
    };
    const tree = renderer.render(<ProductOptions {...props} />);

    expect(tree).toMatchSnapshot();
});

test('it renders the correct tree', () => {
    const props = {
        options: [
            {
                label: 'Label 1',
                value: 'Value 1'
            },
            {
                label: 'Label 2',
                value: 'Value 2'
            }
        ]
    };
    const tree = renderer.render(<ProductOptions {...props} />);

    expect(tree).toMatchSnapshot();
});
