import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Dialog from '../dialog';

jest.mock('../../../classify');
jest.mock('../../Modal', () => ({
    Modal: props => <modal-mock>{props.children}</modal-mock>
}));

const props = {
    isModal: true,
    isOpen: true,
    shouldDisableButtons: false,
    title: 'Unit Test Dialog Title'
};

test('renders a basic Dialog', () => {
    // Act.
    const wrapper = createTestInstance(<Dialog {...props} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders a Dialog with disabled buttons', () => {
    // Arrange.
    const myProps = {
        ...props,
        shouldDisableButtons: true
    };

    // Act.
    const wrapper = createTestInstance(<Dialog {...myProps} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('supports modifying title and button texts', () => {
    // Arrange.
    const myProps = {
        ...props,
        cancelText: 'Unit Test Cancel',
        confirmText: 'Unit Test Confirm',
        title: 'Unit Test Title'
    };

    // Act.
    const wrapper = createTestInstance(<Dialog {...myProps} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});
