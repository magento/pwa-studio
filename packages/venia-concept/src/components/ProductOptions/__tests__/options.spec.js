import React from 'react';
import testRenderer from 'react-test-renderer';

import Options from '../options';

jest.mock('src/classify');
jest.mock('uuid/v4', () => () => '00000000-0000-0000-0000-000000000000');

const onSelectionChangeMock = jest.fn();
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
    const component = testRenderer.create(<Options {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('does not call onSelectionChange if not provided', () => {
    const component = testRenderer.create(<Options {...defaultProps} />);
    component.getInstance().handleSelectionChange(0, 'test');
    expect(onSelectionChangeMock).not.toHaveBeenCalled();

    onSelectionChangeMock.mockReset();
});

test('calls onSelectionChange function with optionId and selection', () => {
    const props = {
        ...defaultProps,
        onSelectionChange: onSelectionChangeMock
    };
    const component = testRenderer.create(<Options {...props} />);

    component.getInstance().handleSelectionChange(0, 'test');
    expect(onSelectionChangeMock).toHaveBeenCalledWith(0, 'test');

    onSelectionChangeMock.mockReset();
});
