import React, { useRef } from 'react';
import { act, create } from 'react-test-renderer';
import { useLazyQuery } from '@apollo/client';
import useLink from '../useLink';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';

jest.mock('react', () => {
    const react = jest.requireActual('react');
    const useRef = jest.fn(() => ({ current: 'bar' }));

    return {
        ...react,
        useRef
    };
});

jest.mock('@apollo/client', () => {
    const ApolloClient = jest.requireActual('@apollo/client');
    const useLazyQuery = jest.fn();

    return {
        ...ApolloClient,
        useLazyQuery
    };
});

jest.mock('../../MagentoRoute/magentoRoute.gql', () => ({
    resolveUrlQuery: null
}));

jest.mock('../../../util/makeUrl', () =>
    jest.fn(url => {
        return `TEST_PREFIX${url}`;
    })
);

jest.mock('../../../hooks/useIntersectionObserver');

const mockIntersectionObserve = jest.fn();
const mockIntersectionUnobserve = jest.fn();
const mockIntersectionEntries = [{ isIntersecting: true }];
const mockOnIntersect = jest.fn();

class mockIntersectionObserver {
    constructor(onIntersect) {
        mockIntersectionObserve.mockReset();
        mockIntersectionUnobserve.mockReset();

        mockOnIntersect.mockImplementationOnce(() => {
            onIntersect(mockIntersectionEntries);
        });
    }

    observe() {
        mockIntersectionObserve();
    }

    unobserve() {
        mockIntersectionUnobserve();
    }
}

const mockRunQuery = jest.fn();

const mockValidUseLazyQuery = [mockRunQuery, {}];

const mockInvalidUseLazyQuery = [mockRunQuery, { called: true }];

let props = {};

const givenEmptyProps = () => {
    props = {};
};

const givenValidProps = () => {
    props = {
        prefetchType: true,
        innerRef: { current: 'foo' },
        to: '/bar.html'
    };
};

const givenFalsePrefetch = () => {
    givenValidProps();
    props = {
        ...props,
        prefetchType: false
    };
};

const givenInvalidReference = () => {
    givenValidProps();
    props = {
        ...props,
        innerRef: { foo: 'baz' }
    };
};

const givenNoReference = () => {
    givenValidProps();
    props = {
        ...props,
        innerRef: undefined
    };
};

const givenExistingQuery = () => {
    useLazyQuery.mockImplementation(() => mockInvalidUseLazyQuery);
};

const givenInvalidIntersectionObserver = () => {
    useIntersectionObserver.mockImplementation(() => {
        return;
    });
};

const givenValidIntersectionObserver = () => {
    useIntersectionObserver.mockImplementation(() => {
        return mockIntersectionObserver;
    });
};

const whenComponentIsVisible = async () => {
    await act(() => {
        mockOnIntersect();
    });
};

const log = jest.fn().mockName('log');
const Component = () => {
    log(useLink(props));

    return null;
};

beforeEach(() => {
    log.mockClear();
    mockRunQuery.mockClear();
    useLazyQuery.mockClear();
    useLazyQuery.mockImplementation(() => mockValidUseLazyQuery);
    givenValidIntersectionObserver();
    givenValidProps();
});

describe('#useLink fetches page information when', () => {
    test('requirements are met', async () => {
        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                ref: expect.objectContaining({ current: 'foo' })
            })
        );
        expect(mockRunQuery).toHaveBeenCalledTimes(1);
    });
});

describe('#useLink does not run query when', () => {
    test('props are empty', async () => {
        givenEmptyProps();
        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(mockRunQuery).not.toHaveBeenCalled();
    });

    test('should prefetch is false', async () => {
        givenFalsePrefetch();

        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                ref: expect.objectContaining({ current: 'foo' })
            })
        );
        expect(mockRunQuery).not.toHaveBeenCalled();
    });

    test('invalid ref', async () => {
        givenInvalidReference();

        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(mockRunQuery).not.toHaveBeenCalled();
    });

    test('invalid intersection observer', async () => {
        givenInvalidIntersectionObserver();

        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(mockRunQuery).not.toHaveBeenCalled();
    });

    test('query already ran', async () => {
        givenExistingQuery();

        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(mockRunQuery).not.toHaveBeenCalled();
    });

    test('component is not visible', async () => {
        await act(() => {
            create(<Component />);
        });

        expect(log).toHaveBeenCalledTimes(1);
        expect(mockRunQuery).not.toHaveBeenCalled();
    });
});

describe('#useLink processes data', () => {
    test('returns passed reference', async () => {
        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                ref: expect.objectContaining({ current: 'foo' })
            })
        );
    });

    test('generates its own reference', async () => {
        givenNoReference();
        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                ref: expect.objectContaining({ current: 'bar' })
            })
        );
        expect(useRef).toHaveBeenCalled();
    });

    test('generates full URL from props.to', async () => {
        await act(() => {
            create(<Component />);
        });

        await whenComponentIsVisible();

        expect(log).toHaveBeenCalledTimes(1);
        expect(mockRunQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: expect.objectContaining({
                    url: 'TEST_PREFIX/bar.html'
                })
            })
        );
    });
});
