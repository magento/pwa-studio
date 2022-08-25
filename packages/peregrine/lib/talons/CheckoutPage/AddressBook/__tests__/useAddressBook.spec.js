import React from 'react';
import { act } from 'react-test-renderer';

import { useAddressBook } from '../useAddressBook';
import createTestInstance from '../../../../util/createTestInstance';
import { useAppContext } from '../../../../context/app';
import { useMutation } from '@apollo/client';

const mockGetCustomerAddresses = jest.fn().mockReturnValue({
    data: {
        customer: {
            addresses: [
                {
                    firstname: 'Philip',
                    id: 1,
                    lastname: 'Fry',
                    street: ['3000 57th Street']
                },
                {
                    firstname: 'Bender',
                    id: 2,
                    lastname: 'Rodríguez',
                    street: ['3000 57th Street']
                },
                {
                    firstname: 'John',
                    id: 3,
                    lastname: 'Zoidberg',
                    street: ['1 Dumpster Alley']
                }
            ]
        }
    },
    error: false,
    loading: false
});

const mockGetCustomerCartAddress = jest.fn().mockReturnValue({
    data: {
        customerCart: {
            shipping_addresses: [
                {
                    firstname: 'Bender',
                    lastname: 'Rodríguez',
                    street: ['3000 57th Street']
                }
            ]
        }
    },
    error: false,
    loading: false
});

const mockSetCustomerAddressOnCart = jest.fn();

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn().mockImplementation(query => {
        if (query === 'getCustomerAddressesQuery')
            return mockGetCustomerAddresses();

        if (query === 'getCustomerCartAddressQuery')
            return mockGetCustomerCartAddress();

        return;
    }),
    useMutation: jest.fn(() => [
        mockSetCustomerAddressOnCart,
        { loading: true }
    ])
}));

jest.mock('../addressBook.gql', () => ({
    setCustomerAddressOnCartMutation: 'setCustomerAddressOnCartMutation',
    getCustomerAddressesQuery: 'getCustomerAddressesQuery',
    getCustomerCartAddressQuery: 'getCustomerCartAddressQuery'
}));

jest.mock('../../../../context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('../../../../context/user', () => {
    const state = {
        isSignedIn: true
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

const Component = props => {
    const talonProps = useAddressBook(props);
    return <i talonProps={talonProps} />;
};

const toggleActiveContent = jest.fn();
const onSuccess = jest.fn();

const mockProps = {
    toggleActiveContent,
    onSuccess
};

test('returns the correct shape', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns error from apply mutation', () => {
    useMutation.mockReturnValue([
        jest.fn(),
        { error: new Error('setCustomerAddressOnCart Error') }
    ]);

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('setCustomerAddressOnCart Error');
});

test('auto selects new address', () => {
    mockGetCustomerAddresses.mockReturnValueOnce({
        data: {
            customer: {
                addresses: [
                    {
                        firstname: 'Flexo',
                        id: 44,
                        lastname: 'Rodríguez',
                        street: ['3000 57th Street']
                    }
                ]
            }
        },
        error: false,
        loading: false
    });

    const tree = createTestInstance(<Component {...mockProps} />);

    act(() => {
        tree.update(<Component {...mockProps} />);
    });

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    expect(talonProps.selectedAddress).toBe(3);
});

describe('callbacks update and return state', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    test('handleEditAddress', () => {
        const [, { toggleDrawer }] = useAppContext();
        const { handleEditAddress } = talonProps;

        act(() => {
            handleEditAddress('activeAddress');
        });

        const { talonProps: newTalonProps } = root.findByType('i').props;

        expect(toggleDrawer).toHaveBeenCalled();
        expect(newTalonProps.activeAddress).toBe('activeAddress');
    });

    test('handleAddAddress', () => {
        const [, { toggleDrawer }] = useAppContext();
        const { handleAddAddress } = talonProps;

        act(() => {
            handleAddAddress();
        });

        const { talonProps: newTalonProps } = root.findByType('i').props;

        expect(toggleDrawer).toHaveBeenCalled();
        expect(newTalonProps.activeAddress).toBeUndefined();
    });

    test('handleSelectAddress', () => {
        const { handleSelectAddress } = talonProps;

        act(() => {
            handleSelectAddress(318);
        });

        const { talonProps: newTalonProps } = root.findByType('i').props;
        expect(newTalonProps.selectedAddress).toBe(318);
    });

    test('handleApplyAddress', async () => {
        const { handleApplyAddress } = talonProps;

        await act(() => {
            handleApplyAddress();
        });

        expect(mockSetCustomerAddressOnCart).toHaveBeenCalled();
        expect(mockSetCustomerAddressOnCart.mock.calls[0][0]).toMatchSnapshot();
        expect(toggleActiveContent).toHaveBeenCalled();
    });

    test('handleCancel', () => {
        const { handleSelectAddress } = talonProps;

        act(() => {
            handleSelectAddress(318);
        });

        const { talonProps: newTalonProps } = root.findByType('i').props;

        expect(newTalonProps.selectedAddress).toBe(318);

        act(() => {
            newTalonProps.handleCancel();
        });

        const { talonProps: finalTalonProps } = root.findByType('i').props;

        expect(finalTalonProps.selectedAddress).toBe(2);
        expect(toggleActiveContent).toHaveBeenCalled();
    });
});

test('handleApplyAddress error will not toggle content', async () => {
    mockSetCustomerAddressOnCart.mockRejectedValue('Apollo Error');
    useMutation.mockReturnValue([
        mockSetCustomerAddressOnCart,
        {
            error: null,
            loading: false
        }
    ]);

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleApplyAddress } = talonProps;

    await act(() => {
        handleApplyAddress();
    });

    expect(mockSetCustomerAddressOnCart).toHaveBeenCalled();
    expect(toggleActiveContent).not.toHaveBeenCalled();
});

test('handles no customer address data found', () => {
    mockGetCustomerAddresses.mockReturnValueOnce({
        data: {
            customer: {}
        },
        error: false,
        loading: false
    });

    const tree = createTestInstance(<Component {...mockProps} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.customerAddresses).toEqual([]);
});

test('does not auto-select address when customer address count does not change', () => {
    mockGetCustomerAddresses
        .mockReturnValue({
            data: {
                customer: {
                    addresses: [
                        {
                            firstname: 'Flexo',
                            id: 44,
                            lastname: 'Rodríguez',
                            street: ['3000 57th Street']
                        }
                    ]
                }
            },
            error: false,
            loading: false
        })
        .mockReturnValueOnce({
            data: {
                customer: {
                    addresses: [
                        {
                            firstname: 'Bender',
                            id: 2,
                            lastname: 'Rodríguez',
                            street: ['3000 57th Street']
                        }
                    ]
                }
            },
            error: false,
            loading: false
        })
        .mockReturnValueOnce({
            data: {
                customer: {
                    addresses: [
                        {
                            firstname: 'Philip',
                            id: 1,
                            lastname: 'Fry',
                            street: ['3000 57th Street']
                        }
                    ]
                }
            },
            error: false,
            loading: false
        });

    const tree = createTestInstance(<Component {...mockProps} />);

    act(() => {
        tree.update(<Component {...mockProps} />);
    });

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    expect(talonProps.selectedAddress).toBe(2);
});

test('does not set a selected address when there are no available customer cart shipping addresses', () => {
    mockGetCustomerCartAddress.mockReturnValueOnce({
        data: {
            customerCart: {
                shipping_addresses: []
            }
        },
        error: false,
        loading: false
    });
    const tree = createTestInstance(<Component {...mockProps} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.selectedAddress).toBeUndefined();
});

test('should call onSuccess on mutation success', () => {
    createTestInstance(<Component {...mockProps} />);

    const { onCompleted } = useMutation.mock.calls[0][1];
    onCompleted();

    expect(onSuccess).toHaveBeenCalled();
});
