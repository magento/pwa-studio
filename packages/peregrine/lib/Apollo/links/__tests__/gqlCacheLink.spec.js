import { MagentoGQLCacheLink } from '../gqlCacheLink';
import {
    mockGetItem,
    mockSetItem
} from '@magento/peregrine/lib/util/simplePersistence';

jest.mock('@magento/peregrine/lib/util/simplePersistence');

test('it sets the correct context + headers on outgoing requests', () => {
    // Arrange.
    let setContextResult = null;
    const operation = {
        setContext: jest.fn().mockImplementation(implementation => {
            const mockPreviousContext = {
                not: 'headers',
                headers: {
                    something: 'else'
                }
            };
            setContextResult = implementation(mockPreviousContext);
        }),
        getContext: jest.fn()
    };
    const forward = jest.fn().mockReturnValue([]);

    const instance = new MagentoGQLCacheLink();
    instance.setCacheId('unit_test');

    // Act.
    instance.request(operation, forward);

    // Assert.
    expect(operation.setContext).toHaveBeenCalled();

    // It should retain the previous context.
    expect(setContextResult.not).toEqual('headers');

    // It should append to the headers.
    expect(Object.keys(setContextResult.headers)).toHaveLength(2);
    expect(setContextResult.headers['x-magento-cache-id']).toEqual('unit_test');
    expect(setContextResult.headers.something).toEqual('else');
});

test('it tries to seed from local storage', () => {
    // Arrange.
    let setContextResult = null;
    const operation = {
        setContext: jest.fn().mockImplementation(implementation => {
            const mockPreviousContext = {
                not: 'headers',
                headers: {
                    something: 'else'
                }
            };
            setContextResult = implementation(mockPreviousContext);
        }),
        getContext: jest.fn()
    };
    const forward = jest.fn().mockReturnValue([]);
    mockGetItem.mockReturnValueOnce('unit_test_from_storage');

    const instance = new MagentoGQLCacheLink();

    // Act.
    instance.request(operation, forward);

    // Assert.
    expect(setContextResult.headers['x-magento-cache-id']).toEqual(
        'unit_test_from_storage'
    );
});

test('it should save the cache id from responses', () => {
    // Arrange.
    const operation = {
        setContext: jest.fn(),
        getContext: jest.fn().mockImplementation(() => {
            const headers = new Map();
            headers.set('x-magento-cache-id', 'unit_test');

            return {
                response: {
                    headers
                }
            };
        })
    };
    const forward = jest.fn().mockReturnValue([1]);

    const instance = new MagentoGQLCacheLink();

    // Act.
    instance.request(operation, forward);

    // Assert.
    expect(mockSetItem).toHaveBeenCalledTimes(1);
    expect(mockSetItem).toHaveBeenCalledWith('magento_cache_id', 'unit_test');
});

test('it does not update its internal value when not present in the response', () => {
    // Arrange.
    const operation = {
        setContext: jest.fn(),
        getContext: jest.fn().mockImplementation(() => {
            const headers = new Map();

            return {
                response: {
                    headers
                }
            };
        })
    };
    const forward = jest.fn().mockReturnValue([1]);

    const instance = new MagentoGQLCacheLink();

    // Act.
    instance.request(operation, forward);

    // Assert.
    expect(mockSetItem).toHaveBeenCalledTimes(0);
});
