import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useResourceImage } from '../useResourceImage';

const SMALL_RESOURCE_SIZE = 100;
const props = {
    generateSrcset: jest.fn(() => 'mock_srcset'),
    height: 125,
    resource: 'unit_test_resource.jpg',
    resourceUrl: jest.fn(() => 'mock_resource_url'),
    type: 'image-product',
    widthBreakpoints: [],
    widths: [SMALL_RESOURCE_SIZE],
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

    test('works when given a single breakpoint', () => {
        // Arrange.
        const myProps = {
            ...props,
            widthBreakpoints: [75],
            widths: [50, 100]
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

    test('works when given a multiple breakpoints', () => {
        // Arrange.
        const myProps = {
            ...props,
            widthBreakpoints: [100, 200, 300, 400, 500, 600],
            widths: [50, 150, 250, 350, 450, 550, 650]
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        const expected =
            '(max-width: 100px) 50px, (max-width: 200px) 150px, (max-width: 300px) 250px, (max-width: 400px) 350px, (max-width: 500px) 450px, (max-width: 600px) 550px, 650px';
        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                sizes: expected
            })
        );
    });
});
