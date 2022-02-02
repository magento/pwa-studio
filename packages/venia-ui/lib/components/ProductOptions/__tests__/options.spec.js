import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Options from '../options';

jest.mock('../../../classify');
jest.mock('uuid', () => () => '00000000-0000-0000-0000-000000000000');

const defaultProps = {
    options: [
        {
            attribute_id: '1',
            attribute_code: 'fashion_color',
            label: 'option-1',
            values: []
        },
        {
            attribute_id: '2',
            attribute_code: '',
            label: 'option-1',
            values: []
        }
    ]
};

test('renders Options component correctly', () => {
    const component = createTestInstance(<Options {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
});

// TODO: Test this with talon test
test.skip('does not call onSelectionChange if not provided', () => {});

// TODO: Test this with talon test
test.skip('calls onSelectionChange function with optionId and selection', () => {});
