import { createHttpLink } from '@apollo/client';
import getLinks, {
    customFetchToShrinkQuery
} from '@magento/peregrine/lib/Apollo/links';

jest.mock('@apollo/client', () => ({
    __esModule: true,
    createHttpLink: jest.fn(() => 'http')
}));
jest.mock('@magento/peregrine/lib/Apollo/links/authLink', () => ({
    __esModule: true,
    default: jest.fn(() => 'auth')
}));
jest.mock('@magento/peregrine/lib/Apollo/links/errorLink', () => ({
    __esModule: true,
    default: jest.fn(() => 'error')
}));
jest.mock('@magento/peregrine/lib/Apollo/links/gqlCacheLink', () => ({
    __esModule: true,
    default: jest.fn(() => 'gqlCache')
}));
jest.mock('@magento/peregrine/lib/Apollo/links/mutationQueueLink', () => ({
    __esModule: true,
    default: jest.fn(() => 'mutationQueue')
}));
jest.mock('@magento/peregrine/lib/Apollo/links/retryLink', () => ({
    __esModule: true,
    default: jest.fn(() => 'retry')
}));
jest.mock('@magento/peregrine/lib/Apollo/links/storeLink', () => ({
    __esModule: true,
    default: jest.fn(() => 'store')
}));
jest.mock('@magento/peregrine/lib/util/shrinkQuery', () => ({
    __esModule: true,
    default: jest.fn(() => 'bar')
}));

function mockGlobalFetch() {
    const backup = globalThis.fetch;

    globalThis.fetch = void 0;

    return () => {
        globalThis.fetch = backup;
    };
}

test('returns a map', () => {
    const map = getLinks();

    expect(map).toBeInstanceOf(Map);
});

test('returns a map with expected keys and values', () => {
    const map = getLinks();

    expect(map).toMatchSnapshot();
});

test('creates a proper http link', () => {
    getLinks('foo');

    expect(createHttpLink).toHaveBeenCalledTimes(1);
    expect(createHttpLink).toHaveBeenNthCalledWith(1, {
        fetch: customFetchToShrinkQuery,
        useGETForQueries: true,
        uri: 'foo'
    });
});

describe('customFetchToShrinkQuery', () => {
    test('calls fetch', () => {
        const spy = jest
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => {});

        customFetchToShrinkQuery('foo', {});

        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('throws if options is not an object', () => {
        const spy = jest
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => {});

        expect(() => {
            customFetchToShrinkQuery('foo');
        }).toThrow();
        expect(spy).toHaveBeenCalledTimes(0);
    });

    test('bails if fetch is not a function', () => {
        const restore = mockGlobalFetch();
        const ret = customFetchToShrinkQuery('foo', {});

        restore();
        expect(ret).toEqual(expect.any(Function));
    });

    test('shrinks the query for GET operations only', () => {
        const spy = jest
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => {});

        customFetchToShrinkQuery('foo', { method: 'GET' });
        customFetchToShrinkQuery('foo', { method: 'POST' });

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenNthCalledWith(1, 'bar', expect.anything());
        expect(spy).toHaveBeenNthCalledWith(2, 'foo', expect.anything());
    });
});
