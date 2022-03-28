import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useQuantityStepper } from '@magento/peregrine/lib/talons/QuantityStepper/useQuantityStepper';
import Quantity from '../quantity';

jest.mock('../../../../classify');
jest.mock('@magento/peregrine/lib/talons/QuantityStepper/useQuantityStepper');

const mockOnChange = jest.fn();
const defaultProps = {
    initialValue: 1,
    itemId: 'item1',
    label: 'Test Quantity',
    min: 0,
    onChange: mockOnChange,
    message: ''
};

test('renders quantity correctly', () => {
    useQuantityStepper.mockReturnValueOnce({
        isDecrementDisabled: false,
        isIncrementDisabled: false,
        handleBlur: jest.fn(),
        handleDecrement: jest.fn(),
        handleIncrement: jest.fn(),
        maskInput: jest.fn()
    });

    const tree = createTestInstance(<Quantity {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
