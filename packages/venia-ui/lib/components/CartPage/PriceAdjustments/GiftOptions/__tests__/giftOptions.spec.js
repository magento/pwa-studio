import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions';

import GiftOptions from '../giftOptions';

jest.mock('informed', () => ({
    Form: ({ children, ...rest }) => <mock-Form {...rest}>{children}</mock-Form>
}));

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions'
);

jest.mock('../../../../Checkbox', () => props => <mock-Checkbox {...props} />);
jest.mock('../../../../Field', () => ({ children, ...rest }) => (
    <mock-Field {...rest}>{children}</mock-Field>
));
jest.mock('../../../../FormError', () => props => (
    <mock-FormError {...props} />
));
jest.mock('../../../../LoadingIndicator', () => props => (
    <mock-LoadingIndicator {...props} />
));
jest.mock('../../../../TextArea', () => props => <mock-TextArea {...props} />);
jest.mock('../../../../TextInput', () => props => (
    <mock-TextInput {...props} />
));

let inputProps = {};

const talonProps = {
    loading: false,
    errors: [],
    giftReceiptProps: {},
    printedCardProps: {},
    cardToProps: {},
    cardFromProps: {},
    cardMessageProps: {},
    optionsFormProps: {}
};

const Component = () => {
    return <GiftOptions {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        shouldSubmit: jest.fn(),
        giftOptionsConfigData: null
    };
};

const givenOptionsConfigData = () => {
    inputProps.giftOptionsConfigData = {
        allow_order: '1',
        allow_gift_receipt: '1',
        allow_printed_card: '1'
    };
};

describe('#GiftOptions', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders loading indicator when loading', () => {
        useGiftOptions.mockReturnValueOnce({
            ...talonProps,
            loading: true
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders empty form when no options are enabled', () => {
        useGiftOptions.mockReturnValueOnce(talonProps);

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders form when options are enabled', () => {
        givenOptionsConfigData();
        useGiftOptions.mockReturnValueOnce(talonProps);

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
