import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useEditModal } from '@magento/peregrine/lib/talons/AccountInformationPage/useEditModal';

import EditModal from '../editModal';

jest.mock('@magento/peregrine/lib/talons/AccountInformationPage/useEditModal');
jest.mock('../../../classify');
jest.mock('../../Portal', () => ({
    Portal: props => <portal-mock>{props.children}</portal-mock>
}));
jest.mock('../editForm', () => 'EditForm');

const handleClose = jest.fn().mockName('handleClose');
const handleChangePassword = jest.fn().mockName('handleChangePassword');
const handleSubmit = jest.fn().mockName('handleSubmit');

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
    handleChangePassword,
    handleSubmit
};

test('renders open modal', () => {
    useEditModal.mockReturnValueOnce({
        handleClose,
        isOpen: true
    });

    const tree = createTestInstance(<EditModal {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders closed modal', () => {
    useEditModal.mockReturnValueOnce({
        handleClose,
        isOpen: false
    });

    const tree = createTestInstance(<EditModal {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
