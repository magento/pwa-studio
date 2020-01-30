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

    const useQuery = jest.fn(() => cartResult);
    const useLazyQuery = jest.fn(() => [deferredFn, balanceResult]);
    const useMutation = jest.fn(input => {
        if (input === 'mock apply') return [deferredFn, applyCardResult];
        return [deferredFn, removeCardResult];
    });

    return { useLazyQuery, useMutation, useQuery };
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
    applyCardMutation: 'mock apply',
    cardBalanceQuery: 'mock',
    cartQuery: 'mock',
    removeCardMutation: 'mock remove'
};

/*
 *  Tests.
 */

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        canTogglePromptState: expect.any(Boolean),
        checkBalanceData: expect.any(Object),
        errorLoadingGiftCards: expect.any(Boolean),
        errorApplyingCard: expect.any(Boolean),
        errorCheckingBalance: expect.any(Boolean),
        errorRemovingCard: expect.any(Boolean),
        giftCardsData: expect.any(Array),
        handleApplyCard: expect.any(Function),
        handleCheckCardBalance: expect.any(Function),
        handleRemoveCard: expect.any(Function),
        handleTogglePromptState: expect.any(Function),
        isLoadingGiftCards: expect.any(Boolean),
        isApplyingCard: expect.any(Boolean),
        isCheckingBalance: expect.any(Boolean),
        isRemovingCard: expect.any(Boolean),
        shouldDisplayCardBalance: expect.any(Boolean),
        shouldDisplayCardEntry: expect.any(Boolean)
    });
});
