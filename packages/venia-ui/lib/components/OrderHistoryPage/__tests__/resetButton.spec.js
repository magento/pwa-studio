import React from 'react';
import { useFormApi } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import Trigger from '../../Trigger';
import ResetButton from '../resetButton';

jest.mock('informed', () => ({
    useFormApi: jest.fn()
}));

const props = { onReset: jest.fn() };

test('renders reset trigger', () => {
    const tree = createTestInstance(<ResetButton {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('calls reset handlers on click', () => {
    const mockReset = jest.fn();
    useFormApi.mockReturnValue({ reset: mockReset });

    const { root } = createTestInstance(<ResetButton {...props} />);
    const triggerNode = root.findByType(Trigger);
    const { action } = triggerNode.props;

    action();

    expect(mockReset).toHaveBeenCalled();
    expect(props.onReset).toHaveBeenCalled();
});
