import React from 'react';
import { IntlProvider } from 'react-intl';

import { createTestInstance } from '@magento/peregrine';
import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions';

import GiftOptions from '../giftOptions';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl')
}));
jest.mock('informed', () => ({
    Form: ({ children, ...rest }) => <mock-Form {...rest}>{children}</mock-Form>
}));

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions'
);
jest.mock('@magento/venia-ui/lib/classify');
jest.mock('@magento/venia-ui/lib/components/Button', () => props => (
    <mock-Button {...props} />
));
jest.mock('@magento/venia-ui/lib/components/Checkbox', () => props => (
    <mock-Checkbox {...props} />
));
jest.mock(
    '@magento/venia-ui/lib/components/Field',
    () => ({ children, ...rest }) => (
        <mock-Field {...rest}>{children}</mock-Field>
    )
);
jest.mock('@magento/venia-ui/lib/components/FormError', () => props => (
    <mock-FormError {...props} />
));
jest.mock('@magento/venia-ui/lib/components/Icon', () => props => (
    <mock-Icon {...props} />
));
jest.mock('@magento/venia-ui/lib/components/LoadingIndicator', () => ({
    __esModule: true,
    default: jest
        .fn()
        .mockImplementation(props => <mock-LoadingIndicator {...props} />),
    Spinner: jest.fn().mockImplementation(props => <mock-Spinner {...props} />)
}));
jest.mock('@magento/venia-ui/lib/components/LinkButton', () => props => (
    <mock-LinkButton {...props} />
));
jest.mock('@magento/venia-ui/lib/components/Price', () => props => (
    <mock-Price {...props} />
));
jest.mock('@magento/venia-ui/lib/components/TextArea', () => props => (
    <mock-TextArea {...props} />
));
jest.mock('@magento/venia-ui/lib/components/TextInput', () => props => (
    <mock-TextInput {...props} />
));

let inputProps = {};

const talonProps = {
    loading: false,
    errors: [],
    savingOptions: [],
    giftReceiptProps: {
        field: 'includeGiftReceipt'
    },
    printedCardProps: {
        field: 'includePrintedCard'
    },
    printedCardPrice: {},
    giftMessageCheckboxProps: {
        field: 'includeGiftMessage'
    },
    giftMessageResult: {},
    hasGiftMessage: false,
    showGiftMessageResult: false,
    cardToProps: {
        field: 'cardTo'
    },
    cardFromProps: {
        field: 'cardFrom'
    },
    cardMessageProps: {
        field: 'cardMessage'
    },
    editGiftMessageButtonProps: {},
    cancelGiftMessageButtonProps: {},
    saveGiftMessageButtonProps: {},
    optionsFormProps: {}
};

const Component = () => {
    return (
        <IntlProvider locale="en-US">
            <GiftOptions {...inputProps} />
        </IntlProvider>
    );
};

const givenDefaultValues = () => {
    inputProps = {
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

    it('renders form returns errors', () => {
        givenOptionsConfigData();
        useGiftOptions.mockReturnValueOnce({
            ...talonProps,
            errors: new Map([['query', { message: 'error' }]])
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders form when gift message form is opened', () => {
        givenOptionsConfigData();
        useGiftOptions.mockReturnValueOnce({
            ...talonProps,
            showGiftMessageResult: true
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders form when gift message exists', () => {
        givenOptionsConfigData();
        useGiftOptions.mockReturnValueOnce({
            ...talonProps,
            hasGiftMessage: true,
            giftMessageResult: {
                cardTo: 'To',
                cardFrom: 'From',
                cardMessage: 'Message'
            }
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders form when gift message exists and form is opened', () => {
        givenOptionsConfigData();
        useGiftOptions.mockReturnValueOnce({
            ...talonProps,
            hasGiftMessage: true,
            giftMessageResult: {
                cardTo: 'To',
                cardFrom: 'From',
                cardMessage: 'Message'
            },
            showGiftMessageResult: true
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders printed card price when above 0', () => {
        givenOptionsConfigData();
        useGiftOptions.mockReturnValueOnce({
            ...talonProps,
            printedCardPrice: {
                currency: 'USD',
                value: 10
            }
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders spinners when gift options are saving', () => {
        givenOptionsConfigData();
        useGiftOptions.mockReturnValueOnce({
            ...talonProps,
            savingOptions: [
                'includeGiftReceipt',
                'includePrintedCard',
                'giftMessage'
            ]
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
