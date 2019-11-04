import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useImage } from '../useImage';

const SMALL_RESOURCE_SIZE = 50;
const props = {
    onError: jest.fn(),
    onLoad: jest.fn(),
    widths: [SMALL_RESOURCE_SIZE]
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
    test('falls back to the first entry in widths', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        // Assert.
        const firstWidthEntry = props.widths[0];
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceWidth: firstWidthEntry
            })
        );
    });

    test('returns undefined if widths is not present', () => {
        // Arrange.
        const myProps = {
            ...props,
            widths: undefined
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceWidth: undefined
            })
        );
    });
});
