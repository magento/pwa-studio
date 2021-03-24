import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import LocaleProvider from '../localeProvider';
import { IntlProvider } from 'react-intl';
import { useQuery } from '@apollo/client';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const useQuery = jest.fn().mockReturnValue({});

    return {
        ...apolloClient,
        useQuery
    };
});

const mockFetchLocaleData = jest.fn();

beforeAll(() => {
    global.__fetchLocaleData__ = mockFetchLocaleData.mockResolvedValue({
        default: 'fetchLocaleData messages'
    });
});

test('render provider with default locale', async () => {
    const tree = await createTestInstance(
        <LocaleProvider children={'rendered children content'} />
    );
    const { root } = tree;
    const intlProvider = root.findByType(IntlProvider);

    expect(tree.toJSON()).toMatchInlineSnapshot(`"rendered children content"`);
    expect(intlProvider.props.defaultLocale).toBe('en-US');
    expect(intlProvider.props.locale).toBe('en-US');
    expect(intlProvider.props.messages).toBe('fetchLocaleData messages');
    expect(mockFetchLocaleData.mock.calls[0][0]).toBe('en_US');
});

test('render provider with network response', () => {
    useQuery.mockReturnValue({ data: { storeConfig: { locale: 'fr_FR' } } });

    const { root } = createTestInstance(<LocaleProvider />);
    const intlProvider = root.findByType(IntlProvider);

    expect(intlProvider.props.locale).toBe('fr-FR');
    expect(mockFetchLocaleData.mock.calls[0][0]).toBe('fr_FR');
});
