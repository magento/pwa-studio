import React, { useEffect } from 'react';

import { createTestInstance } from '@magento/peregrine';
import useIntersectionObserver from '../useIntersectionObserver';

const log = jest.fn();

const Component = () => {
    const hookProps = useIntersectionObserver();

    useEffect(() => {
        log(hookProps);
    }, [hookProps]);

    return null;
};

describe('#useIntersectionObserver', () => {
    beforeEach(() => {
        log.mockClear();
    });

    it('returns undefined when Intersection Observer is not available', () => {
        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith(undefined);
    });

    it('returns Intersection Observer when available', () => {
        const mockIntersectionObserver = jest.fn();
        window.IntersectionObserver = mockIntersectionObserver;

        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith(mockIntersectionObserver);
    });
});
