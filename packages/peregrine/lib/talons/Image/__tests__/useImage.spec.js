import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useImage } from '../useImage';

const SMALL_RESOURCE_SIZE = 50;
const props = {
    onError: jest.fn(),
    onLoad: jest.fn(),
    resourceSizes: new Map([['small', SMALL_RESOURCE_SIZE]]),
    resourceWidth: 100
};

const log = jest.fn();
const Component = props => {
    const talonProps = useImage({ ...props });

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
        handleError: expect.any(Function),
        handleImageLoad: expect.any(Function),
        hasError: expect.any(Boolean),
        isLoaded: expect.any(Boolean),
        resourceWidth: expect.any(Number)
    });
});

describe('resourceWidth', () => {
    test('uses the prop, if present', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        // Assert.
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceWidth: props.resourceWidth
            })
        );
    });

    test('falls back to the first entry in resourceSizes if prop is not present', () => {
        // Arrange.
        const myProps = {
            ...props,
            resourceWidth: undefined
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceWidth: SMALL_RESOURCE_SIZE
            })
        );
    });

    test('returns null if prop and resourceSizes are not present', () => {
        // Arrange.
        const myProps = {
            ...props,
            resourceSizes: undefined,
            resourceWidth: undefined
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceWidth: null
            })
        );
    });

    test('returns null if prop is not present and resourceSizes does not have a "small" entry', () => {
        // Arrange.
        const myProps = {
            ...props,
            resourceSizes: new Map([['large', 400]]),
            resourceWidth: undefined
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceWidth: null
            })
        );
    });
});
