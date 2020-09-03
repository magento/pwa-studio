import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EditModal from '../editModal';

jest.mock('../../../classify');
jest.mock('../../Portal', () => ({
    Portal: props => <portal-mock>{props.children}</portal-mock>
}));
jest.mock('../editForm', () => 'EditForm');

const handleActivePassword = jest.fn().mockName('handleActivePassword');
const handleSubmit = jest.fn().mockName('handleSubmit');
const handleCancel = jest.fn().mockName('handleCancel');

const props = {
    classes: {},
    informationData: {
        firstname: 'Huy',
        lastname: 'Kon',
        email: 'huykon@gmail.com'
    },
    isDisabled: false,
    formErrors: [],
    activeChangePassword: false,
    handleActivePassword,
    handleSubmit,
    isOpen: true,
    handleCancel
};

test('it renders correctly', () => {
    // Act.
    const instance = createTestInstance(<EditModal {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it disables the submit button while loading', () => {
    // Act.
    const instance = createTestInstance(
        <EditModal {...props} isDisabled={true} />
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
