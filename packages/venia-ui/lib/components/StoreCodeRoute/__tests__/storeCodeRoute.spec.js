import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useHistory } from 'react-router-dom';
import { mockSetItem } from '@magento/peregrine/lib/util/simplePersistence';
import StoreCodeRoute from '../storeCodeRoute';

jest.mock('react-router-dom', () => {
    const go = jest.fn();
    const createHref = jest.fn();

    return {
        useHistory: jest.fn(() => ({ go, createHref }))
    };
});
jest.mock('@magento/peregrine/lib/util/simplePersistence');

beforeEach(() => {
    global.AVAILABLE_STORE_VIEWS = [
        {
            base_currency_code: 'USD',
            store_code: 'default',
            default_display_currency_code: 'USD',
            id: 1,
            locale: 'en_US',
            secure_base_media_url: 'https://example.com/media/',
            store_name: 'Default Store View'
        },
        {
            base_currency_code: 'EUR',
            store_code: 'french',
            default_display_currency_code: 'EUR',
            id: 2,
            locale: 'fr_FR',
            secure_base_media_url: 'https://example.com/media/abcdef/',
            store_name: 'French'
        }
    ];
});

test('StoreCodeRoute handler updates storage when store code in url is not current store', () => {
    const goMock = jest.fn();
    const createHrefMock = jest.fn();
    useHistory.mockReturnValue({
        go: goMock,
        createHref: createHrefMock
    });

    const originalLocation = globalThis.location;
    delete globalThis.location;
    globalThis.location = {
        ...originalLocation,
        pathname: '/french/test.html'
    };

    createHrefMock.mockReturnValue('default');

    // Render the Route and instantly redirect to the other store
    createTestInstance(<StoreCodeRoute />);

    expect(mockSetItem.mock.calls).toEqual([
        ['store_view_code', 'french'],
        ['store_view_currency', 'EUR'],
        [
            'store_view_secure_base_media_url',
            'https://example.com/media/abcdef/'
        ]
    ]);
    expect(goMock).toHaveBeenCalled();

    globalThis.location = originalLocation;
});
test('StoreCodeRoute handler updates storage when store code in url is same as  current store', () => {
    const goMock = jest.fn();
    const createHrefMock = jest.fn();
    useHistory.mockReturnValue({
        go: goMock,
        createHref: createHrefMock
    });

    const originalLocation = globalThis.location;
    delete globalThis.location;
    globalThis.location = {
        ...originalLocation,
        pathname: '/french/test.html'
    };

    createHrefMock.mockReturnValue('french');

    // Render the Route and instantly redirect to the other store
    createTestInstance(<StoreCodeRoute />);

    expect(goMock).not.toHaveBeenCalled();

    globalThis.location = originalLocation;
});
