import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductOptions from '../productOptions';

test('it renders null when options are missing', () => {
    const tree = createTestInstance(<ProductOptions />);

    expect(tree).toMatchSnapshot();
});

test('it renders null when options is empty', () => {
    const props = {
        options: []
    };
    const tree = createTestInstance(<ProductOptions {...props} />);

    expect(tree).toMatchSnapshot();
});

test('it renders correctly when options is not empty', () => {
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
    const tree = createTestInstance(<ProductOptions {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
