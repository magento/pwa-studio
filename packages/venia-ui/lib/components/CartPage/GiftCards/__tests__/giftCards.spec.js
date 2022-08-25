import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';
import { IntlProvider } from 'react-intl';
import GiftCards from '../giftCards';

jest.mock('../../../../classify');

/*
 *  Mock talon.
 */
jest.mock(
    '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards',
    () => {
        const useGiftCardsTalon = jest.requireActual(
            '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards'
        );
        const spy = jest.spyOn(useGiftCardsTalon, 'useGiftCards');

        return Object.assign(useGiftCardsTalon, { useGiftCards: spy });
    }
);

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/GiftCards/giftCardQueries.gql.ee.js',
    () => ({
        getAppliedGiftCardsQuery: 'mock cart',
        getGiftCardBalanceQuery: 'mock balance',
        applyGiftCardMutation: 'mock apply',
        removeGiftCardMutation: 'mock remove'
    })
);

jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [
        { toasts: new Map() },
        { addToast: jest.fn() }
    ]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});

/*
 *  Member variables.
 */
const talonProps = {
    applyGiftCard: jest.fn(),
    checkBalanceData: {},
    checkGiftCardBalance: jest.fn(),
    errorLoadingGiftCards: false,
    errorApplyingCard: false,
    errorCheckingBalance: false,
    errorRemovingCard: false,
    giftCardsData: [],
    isLoadingGiftCards: false,
    isApplyingCard: false,
    isCheckingBalance: false,
    isRemovingCard: false,
    removeGiftCard: jest.fn(),
    setFormApi: jest.fn(),
    shouldDisplayCardBalance: false,
    shouldDisplayCardError: false,
    submitForm: jest.fn()
};

/*
 *  Tests.
 */

test('it renders correctly with no cards', () => {
    // Arrange.
    useGiftCards.mockReturnValueOnce(talonProps);

    // Act.
    const wrapper = createTestInstance(<GiftCards />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders correctly when it has cards', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        giftCardsData: [
            {
                code: 'unit test code 1',
                current_balance: {
                    currency: 'USD',
                    value: 99
                }
            },
            {
                code: 'unit test code 2',
                current_balance: {
                    currency: 'USD',
                    value: 99
                }
            }
        ]
    };
    useGiftCards.mockReturnValueOnce(myTalonProps);

    // Act.
    const wrapper = createTestInstance(
        <IntlProvider locale="en-US">
            <GiftCards />
        </IntlProvider>
    );

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});
