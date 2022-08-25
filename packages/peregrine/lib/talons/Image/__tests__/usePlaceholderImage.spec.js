import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { usePlaceholderImage } from '../usePlaceholderImage';

const props = {
    displayPlaceholder: true,
    imageHasError: false,
    imageIsLoaded: true
};

const log = jest.fn();
const Component = props => {
    const talonProps = usePlaceholderImage({ ...props });

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
        shouldRenderPlaceholder: expect.any(Boolean)
    });
});

describe('shouldRenderPlaceholder', () => {
    test('is false when the image has already loaded without error', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        // Assert.
        expect(log).toHaveBeenCalledWith({
            shouldRenderPlaceholder: false
        });
    });

    test('is false when displayPlaceholder is false', () => {
        // Arrange.
        const myProps = {
            ...props,
            displayPlaceholder: false
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        expect(log).toHaveBeenCalledWith({
            shouldRenderPlaceholder: false
        });
    });

    test('is true when the image hasnt loaded yet', () => {
        // Arrange.
        const myProps = {
            ...props,
            imageIsLoaded: false
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        expect(log).toHaveBeenCalledWith({
            shouldRenderPlaceholder: true
        });
    });

    test('is true when the image load failed', () => {
        // Arrange.
        const myProps = {
            ...props,
            imageHasError: true
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        expect(log).toHaveBeenCalledWith({
            shouldRenderPlaceholder: true
        });
    });
});
