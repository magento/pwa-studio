import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useIsInViewport } from '../useIsInViewport';

const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
let mockEntries;

window.IntersectionObserver = jest.fn(callback => {
    const mockConstructor = {
        observe: mockObserve,
        unobserve: mockUnobserve
    };

    callback(mockEntries, mockConstructor);

    return mockConstructor;
});

const log = jest.fn();

let inputValues = {};

const Component = () => {
    const hookProps = useIsInViewport(inputValues);

    useEffect(() => {
        log(hookProps);
    }, [hookProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        elementRef: null
    };
    mockEntries = [];
};

const givenEntries = () => {
    mockEntries = [{ isIntersecting: true }];
};

const givenReference = () => {
    inputValues = {
        elementRef: {
            current: {}
        }
    };
};

describe('#useIsInViewport', () => {
    beforeEach(() => {
        log.mockClear();
        givenDefaultValues();
    });

    it('returns true when no reference is provided', () => {
        const root = createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith(true);

        act(() => {
            root.unmount();
        });

        expect(mockUnobserve).not.toHaveBeenCalled();
    });

    it('returns false when reference is provided and no entry is intersecting', () => {
        givenReference();
        const root = createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith(false);
        expect(mockObserve).toHaveBeenCalled();

        act(() => {
            root.unmount();
        });

        expect(mockUnobserve).toHaveBeenCalled();
    });

    it('returns true when reference is provided and at least one entry is intersecting', () => {
        givenEntries();
        givenReference();

        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith(true);
        expect(mockObserve).toHaveBeenCalled();
    });
});
