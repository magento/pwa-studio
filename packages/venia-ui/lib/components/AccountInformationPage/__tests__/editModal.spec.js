import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EditModal from '../editModal';

jest.mock('../../../classify');
jest.mock('../../Portal', () => ({
    Portal: props => <portal-mock>{props.children}</portal-mock>
}));
jest.mock('../editForm', () => 'EditForm');

const onSubmit = jest.fn().mockName('onSubmit');
const onCancel = jest.fn().mockName('onCancel');

const props = {
    classes: {},
    formErrors: [],
    onCancel,
    onSubmit,
    initialValues: {
        firstname: 'Foo',
        lastname: 'Bar',
        email: 'foobar@express.net'
    },
    isDisabled: false,
    isOpen: true
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
