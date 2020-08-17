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
                option_label: 'Label 1',
                value_label: 'Value 1'
            },
            {
                option_label: 'Label 2',
                value_label: 'Value 2'
            }
        ]
    };
    const tree = renderer.render(<ProductOptions {...props} />);

    expect(tree).toMatchSnapshot();
});
