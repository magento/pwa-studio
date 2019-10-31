import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useResourceImage } from '../useResourceImage';

const SMALL_RESOURCE_SIZE = 100;
const props = {
    generateSrcset: jest.fn(() => 'mock_srcset'),
    resource: 'unit_test_resource.jpg',
    resourceHeight: 125,
    resourceSizeBreakpoints: new Map(),
    resourceSizes: new Map([['small', SMALL_RESOURCE_SIZE]]),
    resourceUrl: jest.fn(() => 'mock_resource_url'),
    resourceWidth: SMALL_RESOURCE_SIZE,
    type: 'image-product'
};

const log = jest.fn();
const Component = props => {
    const talonProps = useResourceImage({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        sizes: expect.any(String),
        src: expect.any(String),
        srcSet: expect.any(String)
    });
});

test('it calls generateSrcset and resourceUrl', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(props.generateSrcset).toHaveBeenCalled();
    expect(props.resourceUrl).toHaveBeenCalled();
});

describe('sizes', () => {
    test('works when given no breakpoints', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        // Assert.
        const expected = `${SMALL_RESOURCE_SIZE}px`;
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                sizes: expected
            })
        );
    });

    test('works when given a small breakpoint only', () => {
        // Arrange.
        const myProps = {
            ...props,
            resourceSizeBreakpoints: new Map([['small', 75]]),
            resourceSizes: new Map([['small', 50], ['medium', 100]])
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        const expected = '(max-width: 75px) 50px, 100px';
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                sizes: expected
            })
        );
    });

    test('works when given a small and medium breakpoint', () => {
        // Arrange.
        const myProps = {
            ...props,
            resourceSizeBreakpoints: new Map([['small', 75], ['medium', 125]]),
            resourceSizes: new Map([
                ['small', 50],
                ['medium', 100],
                ['large', 150]
            ])
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        const expected =
            '(max-width: 75px) 50px, (max-width: 125px) 100px, 150px';
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                sizes: expected
            })
        );
    });
});
