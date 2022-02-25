import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import ImageShimmer from '../image.shimmer';

jest.mock('@magento/venia-ui/lib/classify');

describe('renders ImageShimmer correctly', () => {
    test('render empty ImageShimmer component', () => {
        const component = createTestInstance(<ImageShimmer />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('renders a ImageShimmer using mobile image dimension', () => {
        Object.defineProperty(window, 'matchMedia', {
            value: jest.fn().mockImplementation(() => ({
                matches: true
            }))
        });

        const props = {
            desktopImage: {
                url: '/desktop-image.jpg',
                dimensions: {
                    height: 300,
                    width: 400,
                    ratio: 0.75
                }
            },
            mobileImage: {
                url: '/mobile-image.png',
                dimensions: {
                    height: 250,
                    width: 125,
                    ratio: 2
                }
            }
        };

        const component = createTestInstance(<ImageShimmer {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('renders a ImageShimmer using mobile image dimension even without desktop image', () => {
        Object.defineProperty(window, 'matchMedia', {
            value: jest.fn().mockImplementation(() => ({
                matches: true
            }))
        });

        const props = {
            mobileImage: {
                url: '/mobile-image.png',
                dimensions: {
                    height: 250,
                    width: 125,
                    ratio: 2
                }
            }
        };

        const component = createTestInstance(<ImageShimmer {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('renders a ImageShimmer using desktop image dimension on mobile device when no mobile image', () => {
        Object.defineProperty(window, 'matchMedia', {
            value: jest.fn().mockImplementation(() => ({
                matches: true
            }))
        });

        const props = {
            desktopImage: {
                url: '/desktop-image.jpg',
                dimensions: {
                    height: 300,
                    width: 400,
                    ratio: 0.75
                }
            },
            mobileImage: null
        };

        const component = createTestInstance(<ImageShimmer {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('renders a ImageShimmer using desktop image dimension', () => {
        Object.defineProperty(window, 'matchMedia', {
            value: jest.fn().mockImplementation(() => ({
                matches: false
            }))
        });

        const props = {
            desktopImage: {
                url: '/desktop-image.jpg',
                dimensions: {
                    height: 300,
                    width: 400,
                    ratio: 0.75
                }
            },
            mobileImage: {
                url: '/mobile-image.png',
                dimensions: {
                    height: 250,
                    width: 125,
                    ratio: 2
                }
            }
        };

        const component = createTestInstance(<ImageShimmer {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });
});
