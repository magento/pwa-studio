import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Dialog from '../dialog';

jest.mock('../../../classify');
jest.mock('../../Portal', () => ({
    Portal: props => <portal-mock>{props.children}</portal-mock>
}));

const props = {
    isOpen: true,
    shouldDisableAllButtons: false,
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
        shouldDisableAllButtons: true
    };

    // Act.
    const wrapper = createTestInstance(<Dialog {...myProps} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders a dialog with only the confirm button disabled', () => {
    // Arrange.
    const myProps = {
        ...props,
        shouldDisableConfirmButton: true
    };

    // Act.
    const wrapper = createTestInstance(<Dialog {...myProps} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders a Dialog with no buttons', () => {
    // Arrange.
    const myProps = {
        ...props,
        shouldShowButtons: false
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

test('does not render a close X button in modal mode', () => {
    // Arrange.
    const myProps = {
        ...props,
        isModal: true
    };

    // Act.
    const wrapper = createTestInstance(<Dialog {...myProps} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('should render children even if dialog is hidden and if shouldUnmountOnHide is false', () => {
    // Arrange.
    const myProps = {
        ...props,
        isOpen: false,
        shouldUnmountOnHide: false
    };

    const CONTENT = 'Dialog Contents';

    // Act.
    const wrapper = createTestInstance(
        <Dialog {...myProps}>
            <div>{CONTENT}</div>
        </Dialog>
    );

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('should unmount children if dialog is hidden and if shouldUnmountOnHide is true', () => {
    // Arrange.
    const myProps = {
        ...props,
        isOpen: false,
        shouldUnmountOnHide: true
    };

    const CONTENT = 'Dialog Contents';

    // Act.
    const wrapper = createTestInstance(
        <Dialog {...myProps}>
            <div>{CONTENT}</div>
        </Dialog>
    );

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});
