import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';

import GiftCards from '../giftCards';

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

/*
 *  Member variables.
 */
const talonProps = {
    canTogglePromptState: true,
    checkBalanceData: {},
    errorLoadingGiftCards: false,
    errorApplyingCard: false,
    errorCheckingBalance: false,
    errorRemovingCard: false,
    giftCardsData: [],
    handleApplyCard: jest.fn(),
    handleCheckCardBalance: jest.fn(),
    handleRemoveCard: jest.fn(),
    handleTogglePromptState: jest.fn(),
    isLoadingGiftCards: false,
    isApplyingCard: false,
    isCheckingBalance: false,
    isRemovingCard: false,
    shouldDisplayCardBalance: false,
    shouldDisplayCardEntry: true
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
            { code: 'unit test code 1' },
            { code: 'unit test code 2' }
        ]
    };
    useGiftCards.mockReturnValueOnce(myTalonProps);

    // Act.
    const wrapper = createTestInstance(<GiftCards />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders the add button when appropriate', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        shouldDisplayCardEntry: false
    };
    useGiftCards.mockReturnValueOnce(myTalonProps);

    // Act.
    const wrapper = createTestInstance(<GiftCards />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});
