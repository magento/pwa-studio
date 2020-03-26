import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useGiftCards } from '../useGiftCards';

/*
 *  Mocked Modules.
 */
jest.mock('@apollo/react-hooks', () => {
    const deferredFn = jest.fn();

    const cartResult = {
        data: {
            cart: {
                applied_gift_cards: [
                    { code: 'unit test card 1' },
                    { code: 'unit test card 2' }
                ]
            }
        },
        error: null,
        loading: false
    };
    const balanceResult = {
        data: {
            giftCardAccount: {
                balance: {
                    currency: 'USD',
                    value: '100'
                },
                code: 'unit test'
            }
        },
        error: null,
        loading: false
    };
    const applyCardResult = {
        data: null,
        error: null,
        loading: false
    };
    const removeCardResult = {
        data: null,
        error: null,
        loading: false
    };

    const useLazyQuery = jest.fn(input => {
        if (input === 'mock cart') return [deferredFn, cartResult];
        return [deferredFn, balanceResult];
    });
    const useMutation = jest.fn(input => {
        if (input === 'mock apply') return [deferredFn, applyCardResult];
        return [deferredFn, removeCardResult];
    });

    return { useLazyQuery, useMutation };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

/*
 *  Member variables.
 */

const log = jest.fn();
const Component = props => {
    const talonProps = useGiftCards({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    setIsCartUpdating: jest.fn(),
    mutations: {
        applyCardMutation: 'mock apply',
        removeCardMutation: 'mock remove'
    },
    queries: {
        cardBalanceQuery: 'mock balance',
        cartQuery: 'mock cart'
    }
};

/*
 *  Tests.
 */

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        applyGiftCard: expect.any(Function),
        canTogglePromptState: expect.any(Boolean),
        checkBalanceData: expect.any(Object),
        checkGiftCardBalance: expect.any(Function),
        errorLoadingGiftCards: expect.any(Boolean),
        errorRemovingCard: expect.any(Boolean),
        giftCardsData: expect.any(Array),
        isLoadingGiftCards: expect.any(Boolean),
        isApplyingCard: expect.any(Boolean),
        isCheckingBalance: expect.any(Boolean),
        isRemovingCard: expect.any(Boolean),
        removeGiftCard: expect.any(Function),
        setFormApi: expect.any(Function),
        shouldDisplayCardBalance: expect.any(Boolean),
        shouldDisplayCardEntry: expect.any(Boolean),
        shouldDisplayCardError: expect.any(Boolean),
        submitForm: expect.any(Function),
        togglePromptState: expect.any(Function)
    });
});
