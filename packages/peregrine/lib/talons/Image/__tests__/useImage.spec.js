import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useImage } from '../useImage';

const props = {
    onError: jest.fn(),
    onLoad: jest.fn(),
    widths: new Map().set('default', 50),
    ratio: 4 / 5
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
        resourceWidth: expect.any(Number),
        resourceHeight: expect.any(Number)
    });
});

describe('resourceWidth', () => {
    test('uses width if present', () => {
        // Arrange.
        const myProps = {
            ...props,
            width: 75
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceWidth: myProps.width
            })
        );
    });

    test('falls back to the default entry in widths', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        // Assert.
        const defaultWidthEntry = props.widths.get('default');
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceWidth: defaultWidthEntry
            })
        );
    });

    test('returns undefined if width and widths are not present', () => {
        // Arrange.
        const myProps = {
            ...props,
            width: undefined,
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

describe('resourceHeight', () => {
    test('should return height if not a falsy value', () => {
        const newProps = {
            ...props,
            height: 500
        };

        createTestInstance(<Component {...newProps} />);

        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceHeight: 500
            })
        );
    });

    test('should return height set to undefined if ratio is falsy', () => {
        const newProps = {
            ...props,
            height: null,
            ratio: null
        };

        createTestInstance(<Component {...newProps} />);

        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceHeight: undefined
            })
        );
    });

    test('should return height set to undefined if resourceWidth is falsy', () => {
        const newProps = {
            ...props,
            height: null,
            widths: null
        };

        createTestInstance(<Component {...newProps} />);

        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceHeight: undefined
            })
        );
    });

    test('should derive height from resourceWidth and ratio if they are not falsy', () => {
        const newProps = {
            ...props,
            height: null,
            ratio: 4 / 5,
            width: 100
        };

        createTestInstance(<Component {...newProps} />);

        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceHeight: 500 / 4
            })
        );
    });
});
