import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useGiftCards } from '../useGiftCards';
import { act } from 'react-test-renderer';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

/*
 *  Mocked Modules.
 */
jest.mock('@apollo/client', () => {
    const useLazyQuery = jest.fn();
    const useMutation = jest.fn();
    const useQuery = jest.fn();

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

jest.mock('informed', () => ({
    useFormApi: jest.fn().mockReturnValue({
        getValue: jest.fn().mockReturnValue('mock card code'),
        reset: jest.fn()
    })
}));

jest.mock('../giftCardQueries.gql', () => ({
    getAppliedGiftCardsQuery: 'mock cart',
    getGiftCardBalanceQuery: 'mock balance',
    applyGiftCardMutation: 'mock apply',
    removeGiftCardMutation: 'mock remove'
}));

/*
 *  Member variables.
 */
const log = jest.fn();
const Component = props => {
    const talonProps = useGiftCards({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return <div {...talonProps} id={'giftCard'} />;
};

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

const setIsCartUpdating = jest.fn();

const props = {
    setIsCartUpdating: setIsCartUpdating
};

/*
 *  Tests.
 */
test('it returns the proper shape', () => {
    useQuery.mockReturnValue(cartResult);
    useLazyQuery.mockReturnValue([deferredFn, balanceResult]);

    useMutation.mockImplementation(input => {
        if (input === 'mock apply') return [deferredFn, applyCardResult];
        return [deferredFn, removeCardResult];
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        applyGiftCard: expect.any(Function),
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
        shouldDisplayCardBalance: expect.any(Boolean),
        shouldDisplayCardError: expect.any(Boolean)
    });
});

test('returns error message with invalid request', () => {
    applyCardResult.error = true;

    useLazyQuery.mockImplementation(input => {
        if (input === 'mock cart') return [deferredFn, cartResult];
        return [deferredFn, balanceResult];
    });

    useMutation.mockImplementation(input => {
        if (input === 'mock apply') return [deferredFn, applyCardResult];
        return [deferredFn, removeCardResult];
    });

    // First mount the component so we can pass in a mocked formApi
    const component = createTestInstance(<Component {...props} />);
    let talonProps = component.root.findByProps({ id: 'giftCard' }).props;

    // Set the formApi and update the component so it has access to the form API
    act(() => {
        component.update(<Component {...props} />);
    });

    // Retrieve the new talon props, which will have access form api
    talonProps = component.root.findByProps({ id: 'giftCard' }).props;

    // Call apply gift card, which now has access to the form api
    act(() => {
        talonProps.applyGiftCard();
    });

    // Verify the 3 re-render will have the shouldDisplayCardError set to true.
    expect(log).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
            shouldDisplayCardError: true
        })
    );
});

test('it runs the card balance query when checkGiftCardBalance() is called', () => {
    const checkCardBalance = jest.fn();

    useLazyQuery.mockImplementation(input => {
        if (input === 'mock balance') return [checkCardBalance, balanceResult];
    });

    // Act.
    const component = createTestInstance(<Component {...props} />);

    let talonProps = component.root.findByProps({ id: 'giftCard' }).props;

    const mockCardCode = 'mock card code';

    act(() => {
        component.update(<Component {...props} />);
    });

    talonProps = component.root.findByProps({ id: 'giftCard' }).props;

    expect(talonProps.shouldDisplayCardBalance).toBeFalsy();

    act(() => {
        talonProps.checkGiftCardBalance();
    });

    talonProps = component.root.findByProps({ id: 'giftCard' }).props;

    expect(talonProps.shouldDisplayCardBalance).toBeTruthy();

    expect(checkCardBalance).toHaveBeenCalledWith(
        expect.objectContaining({
            variables: {
                giftCardCode: mockCardCode
            }
        })
    );
});

test('it runs the remove card mutation when removeGiftCard() is called', () => {
    const removeCard = jest.fn();
    removeCardResult.called = true;
    removeCardResult.loading = true;

    useMutation.mockImplementation(input => {
        if (input === 'mock remove') return [removeCard, removeCardResult];
        if (input === 'mock apply') return [deferredFn, applyCardResult];
    });

    // Act.
    const component = createTestInstance(<Component {...props} />);

    const talonProps = component.root.findByProps({ id: 'giftCard' }).props;

    const mockGiftCardCode = 'mock gift card code';

    act(() => {
        talonProps.removeGiftCard(mockGiftCardCode);
    });

    expect(removeCard).toHaveBeenCalledWith(
        expect.objectContaining({
            variables: {
                cartId: 'cart123',
                giftCardCode: mockGiftCardCode
            }
        })
    );

    expect(talonProps.isRemovingCard).toBeTruthy();

    expect(setIsCartUpdating).toHaveBeenCalledTimes(1);
    expect(setIsCartUpdating).toHaveBeenCalledWith(true);
});

test('it handles no applied gift cards', () => {
    useQuery.mockReturnValue({
        ...cartResult,
        data: {
            cart: {
                applied_gift_cards: null // or []
            }
        }
    });

    useLazyQuery.mockReturnValue([deferredFn, balanceResult]);

    useMutation.mockImplementation(input => {
        if (input === 'mock apply') return [deferredFn, applyCardResult];
        return [deferredFn, removeCardResult];
    });

    // Act.
    const component = createTestInstance(<Component {...props} />);

    const talonProps = component.root.findByProps({ id: 'giftCard' }).props;

    expect(talonProps.giftCardsData).toStrictEqual([]);
});
