import React from 'react';
import testRenderer from 'react-test-renderer';
import ResetButton from '../resetButton';

jest.mock('src/classify');

test('renders a ResetButton component', () => {
    const props = {
        resetCheckout: jest.fn()
    };
    const component = testRenderer.create(<ResetButton {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
