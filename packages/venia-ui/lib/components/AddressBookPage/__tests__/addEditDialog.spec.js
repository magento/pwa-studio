import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import AddEditDialog from '../addEditDialog';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('../../Country', () => 'Country');
jest.mock('../../Dialog', () => 'Dialog');
jest.mock('../../FormError', () => 'FormError');
jest.mock('../../Postcode', () => 'Postcode');
jest.mock('../../Region', () => 'Region');

const props = {
    activeEditAddress: {},
    classes: {},
    formErrors: [],
    isEditMode: false,
    isOpen: true,
    handleCancel: jest.fn().mockName('handleCancel'),
    handleConfirm: jest.fn().mockName('handleConfirm')
};

it('renders correctly', () => {
    // Act.
    const instance = createTestInstance(<AddEditDialog {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders correctly with errors', () => {
    // Arrange.
    const testProps = {
        ...props,
        formErrors: ['Unit Test Error 1', 'Unit Test Error 2']
    };

    // Act.
    const instance = createTestInstance(<AddEditDialog {...testProps} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

describe('Edit Mode', () => {
    const editModeProps = {
        ...props,
        isEditMode: true,
        activeEditAddress: {
            region: {
                region: 'Arizona',
                region_code: 'AZ'
            },
            country_code: 'US',
            street: ['123 Main Street'],
            telephone: '7777777777',
            postcode: '77777',
            city: 'Phoenix',
            firstname: 'Bob',
            lastname: 'Loblaw'
        }
    };

    it('renders correctly', () => {
        // Act.
        const instance = createTestInstance(
            <AddEditDialog {...editModeProps} />
        );

        // Assert.
        expect(instance.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with errors', () => {
        // Arrange.
        const testProps = {
            ...editModeProps,
            formErrors: ['Unit Test Error 1', 'Unit Test Error 2']
        };

        // Act.
        const instance = createTestInstance(<AddEditDialog {...testProps} />);

        // Assert.
        expect(instance.toJSON()).toMatchSnapshot();
    });
});
