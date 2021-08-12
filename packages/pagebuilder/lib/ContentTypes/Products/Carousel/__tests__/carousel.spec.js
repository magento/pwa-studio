import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Carousel from '../carousel';

jest.mock('react-slick', () => props => <mock-SlickSlider {...props} />);

jest.mock('react-router-dom', () => ({
    Link: ({ children }) => children
}));

jest.mock('@magento/venia-drivers', () => ({
    resourceUrl: () => 'a.url'
}));

jest.mock(
    '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/useCarousel',
    () => ({
        useCarousel: () => ({ storeConfig: jest.fn().mockName('storeConfig') })
    })
);

jest.mock('@magento/venia-ui/lib/components/Gallery/item', () => props => (
    <mock-GalleryItem {...props} />
));

const items = [
    {
        id: 1,
        name: 'Test Product 1',
        small_image: {
            url: '/test/product/1.png'
        },
        price: {
            regularPrice: {
                amount: {
                    value: 100,
                    currency: 'USD'
                }
            }
        },
        url_key: 'test-product1'
    },
    {
        id: 2,
        name: 'Test Product 2',
        small_image: {
            url: '/test/product/2.png'
        },
        price: {
            regularPrice: {
                amount: {
                    value: 100,
                    currency: 'USD'
                }
            }
        },
        url_key: 'test-product2'
    }
];

test('renders if `items` is an empty array', () => {
    const wrapper = createTestInstance(<Carousel items={[]} />);
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders if `items` is an array of objects', () => {
    const wrapper = createTestInstance(<Carousel items={items} />);
    expect(wrapper.toJSON()).toMatchSnapshot();
});
