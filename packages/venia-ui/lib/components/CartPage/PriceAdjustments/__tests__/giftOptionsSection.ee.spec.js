import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import { useGiftOptionsSection } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/useGiftOptionsSection';

import GiftOptionsSection from '../giftOptionsSection.ee';

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/useGiftOptionsSection'
);
jest.mock('../../../Accordion', () => ({
    Section: ({ children, ...rest }) => (
        <mock-Section {...rest}>{children}</mock-Section>
    )
}));

const Component = () => {
    return <GiftOptionsSection />;
};

describe('#GiftOptionsSection EE', () => {
    it('renders loading', () => {
        useGiftOptionsSection.mockReturnValueOnce({
            giftOptionsConfigData: {},
            isLoading: true,
            isVisible: false
        });

        const tree = createTestInstance(<Component />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders not loading and not visible', () => {
        useGiftOptionsSection.mockReturnValueOnce({
            giftOptionsConfigData: {},
            isLoading: false,
            isVisible: false
        });

        const tree = createTestInstance(<Component />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders not loading and visible', () => {
        useGiftOptionsSection.mockReturnValueOnce({
            giftOptionsConfigData: {},
            isLoading: false,
            isVisible: true
        });

        const tree = createTestInstance(<Component />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
