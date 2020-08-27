import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCartTrigger } from '../useCartTrigger';

jest.mock('@apollo/client', () => {
    return {
        useApolloClient: jest.fn(),
        useQuery: jest.fn(() => ({ data: { cart: { total_quantity: 10 } } })),
        useMutation: jest.fn(() => [jest.fn()])
    };
});
jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn().mockReturnValue({
            location: {
                pathname: '/'
            }
        })
    };
});
jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = { getCartDetails: jest.fn() };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});
jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    return {
        useAwaitQuery: jest.fn(jest.fn())
    };
});
jest.mock('@magento/peregrine/lib/hooks/useDropdown', () => {
    return {
        useDropdown: jest.fn(() => ({
            elementRef: { current: {} },
            expanded: true,
            setExpanded: jest.fn()
        }))
    };
});

const log = jest.fn();
const Component = props => {
    const talonProps = useCartTrigger({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

test('it returns the proper shape', () => {
    // Arrange.
    const props = {
        mutations: {
            createCartMutation: 'createCart'
        },
        queries: {
            getCartDetailsQuery: 'getCartDetails',
            getItemCountQuery: 'getItemCount'
        }
    };

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        handleLinkClick: expect.any(Function),
        handleTriggerClick: expect.any(Function),
        itemCount: expect.any(Number),
        miniCartIsOpen: expect.any(Boolean),
        miniCartRef: expect.any(Object),
        hideCartTrigger: expect.any(Boolean),
        setMiniCartIsOpen: expect.any(Function)
    });
});
