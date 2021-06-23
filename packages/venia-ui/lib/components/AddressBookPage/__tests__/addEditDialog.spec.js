import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import AddEditDialog from '../addEditDialog';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('../../Country', () => 'Country');
jest.mock('../../Dialog', () => 'Dialog');
jest.mock('../../FormError', () => 'FormError');
jest.mock('../../Postcode', () => 'Postcode');
jest.mock('../../Region', () => 'Region');

const props = {
    classes: {},
    formErrors: new Map([]),
    isBusy: false,
    isEditMode: false,
    isOpen: true,
    onCancel: jest.fn().mockName('onCancel'),
    onConfirm: jest.fn().mockName('onConfirm')
};

beforeAll(() => {
    // informed's random ids make snapshots unstable
    jest.spyOn(Math, 'random').mockReturnValue(0);
});

it('renders correctly', () => {
    // Act.
    const instance = createTestInstance(
        <Form>
            <AddEditDialog {...props} />
        </Form>
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders correctly with errors', () => {
    // Arrange.
    const testProps = {
        ...props,
        formErrors: new Map([
            ['createCustomerAddressMutation', 'Unit Test Error 1'],
            ['updateCustomerAddressMutation', 'Unit Test Error 2']
        ])
    };

    // Act.
    const instance = createTestInstance(
        <Form>
            <AddEditDialog {...testProps} />
        </Form>
    );

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
            <Form>
                <AddEditDialog {...editModeProps} />
            </Form>
        );

        // Assert.
        expect(instance.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with errors', () => {
        // Arrange.
        const testProps = {
            ...editModeProps,
            formErrors: new Map([
                ['createCustomerAddressMutation', 'Unit Test Error 1'],
                ['updateCustomerAddressMutation', 'Unit Test Error 2']
            ])
        };

        // Act.
        const instance = createTestInstance(
            <Form>
                <AddEditDialog {...testProps} />
            </Form>
        );

        // Assert.
        expect(instance.toJSON()).toMatchSnapshot();
    });
});
