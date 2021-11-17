import React from 'react';
import { createTestInstance, useToasts } from '@magento/peregrine';
import { useContactPage } from '@magento/peregrine/lib/talons/ContactPage';
import LoadingIndicator from '../../LoadingIndicator';
import ContactPage from '../contactPage';

jest.mock('react-intl', () => ({
    FormattedMessage: ({ defaultMessage }) => defaultMessage,
    useIntl: () => ({
        formatMessage: ({ defaultMessage }) => defaultMessage
    })
}));

jest.mock('informed', () => ({
    Form: ({ children }) => <mock-Form>{children}</mock-Form>
}));

jest.mock('@magento/peregrine', () => {
    const peregrine = jest.requireActual('@magento/peregrine');

    return {
        ...peregrine,
        useToasts: jest.fn()
    };
});

jest.mock('@magento/peregrine/lib/talons/ContactPage');

jest.mock('../../../classify');

jest.mock('../../Head', () => ({
    Meta: () => 'Setting Meta',
    StoreTitle: () => 'Setting Store Title'
}));

jest.mock('../../Button', () => 'Button');
jest.mock('../../CmsBlock/block', () => props => <mock-CmsBlock {...props} />);
jest.mock('../../FormError', () => 'FormError');
jest.mock('../../Field', () => 'Field');
jest.mock('../../TextInput', () => 'TextInput');
jest.mock('../../TextArea', () => 'TextArea');
jest.mock('../../LoadingIndicator', () => 'LoadingIndicator');
jest.mock('../../ErrorView', () => 'ErrorView');

jest.mock('../contactPage.shimmer', () => 'ContactPageShimmer');

const defaultTalonProps = {
    isEnabled: true,
    cmsBlocks: [],
    errors: new Map(),
    handleSubmit: jest.fn(),
    isBusy: false,
    isLoading: false,
    setFormApi: jest.fn(),
    response: null
};

beforeEach(() => {
    useContactPage.mockImplementation(() => defaultTalonProps);

    useToasts.mockImplementation(() => [
        null,
        {
            addToast: jest.fn()
        }
    ]);
});

test('it renders form', () => {
    const instance = createTestInstance(<ContactPage />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('it shows shimmer while loading', () => {
    useContactPage.mockImplementation(() => ({
        ...defaultTalonProps,
        isEnabled: false,
        isLoading: true
    }));

    const instance = createTestInstance(<ContactPage />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('it shows 404 if disabled', () => {
    useContactPage.mockImplementation(() => ({
        ...defaultTalonProps,
        isEnabled: false
    }));

    const instance = createTestInstance(<ContactPage />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('it displays loader while sending form', () => {
    useContactPage.mockImplementation(() => ({
        ...defaultTalonProps,
        isBusy: true
    }));

    const { root } = createTestInstance(<ContactPage />);

    expect(root.findByType(LoadingIndicator)).toBeTruthy();
});

test('it displays errors', () => {
    useContactPage.mockImplementation(() => ({
        ...defaultTalonProps,
        errors: new Map([['someError', 'message here']])
    }));

    const instance = createTestInstance(<ContactPage />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('it displays cms blocks', () => {
    useContactPage.mockImplementation(() => ({
        ...defaultTalonProps,
        cmsBlocks: [
            {
                identifier: 'contact-us-banner',
                content: 'Banner Content'
            },
            {
                identifier: 'contact-us-sidebar',
                content: 'Sidebar Content'
            }
        ]
    }));

    const instance = createTestInstance(<ContactPage />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('it shows success toast', () => {
    useContactPage.mockImplementation(() => ({
        ...defaultTalonProps,
        response: {
            status: true
        }
    }));

    const addToastMock = jest.fn();
    useToasts.mockImplementation(() => [
        null,
        {
            addToast: addToastMock
        }
    ]);

    createTestInstance(<ContactPage />);

    expect(addToastMock).toHaveBeenCalled();
});
