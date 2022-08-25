import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useResourceImage } from '../useResourceImage';

const SMALL_RESOURCE_SIZE = 100;
const props = {
    generateSrcset: jest.fn(() => 'mock_srcset'),
    generateUrl: jest.fn(() => () => 'mock_resource_url'),
    height: 125,
    resource: 'unit_test_resource.jpg',
    type: 'image-product',
    widths: new Map().set('default', SMALL_RESOURCE_SIZE)
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

test('it calls generateSrcset and generateUrl', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(props.generateSrcset).toHaveBeenCalled();
    expect(props.generateUrl).toHaveBeenCalled();
});

describe('sizes', () => {
    test('works when given a width but no widths', () => {
        // Arrange.
        const myProps = {
            ...props,
            width: 100,
            widths: undefined
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        const expected = '100px';
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                sizes: expected
            })
        );
    });

    test('returns an empty string when given no width or widths', () => {
        // Arrange.
        const myProps = {
            ...props,
            width: undefined,
            widths: undefined
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        const expected = '';
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                sizes: expected
            })
        );
    });

    test('works when given a single "default" breakpoint', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        // Assert.
        const expected = '100px';
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                sizes: expected
            })
        );
    });

    test('works when given a multiple breakpoints', () => {
        // Arrange.
        const myProps = {
            ...props,
            widths: new Map()
                .set(100, 50)
                .set(200, 150)
                .set(300, 250)
                .set(400, 350)
                .set('default', 450)
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        const expected =
            '(max-width: 100px) 50px, (max-width: 200px) 150px, (max-width: 300px) 250px, (max-width: 400px) 350px, 450px';
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                sizes: expected
            })
        );
    });
});
