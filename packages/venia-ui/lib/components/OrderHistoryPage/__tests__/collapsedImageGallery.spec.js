import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCollapsedImageGallery } from '@magento/peregrine/lib/talons/OrderHistoryPage/useCollapsedImageGallery';

import CollapsedImageGallery from '../collapsedImageGallery';

jest.mock(
    '@magento/peregrine/lib/talons/OrderHistoryPage/useCollapsedImageGallery'
);

jest.mock('../../../classify');
jest.mock('../../Image', () => 'Image');

test('renders empty container without image data', () => {
    useCollapsedImageGallery.mockReturnValue({});

    const tree = createTestInstance(<CollapsedImageGallery items={[]} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

describe('renders correctly with data', () => {
    test('without remainder', () => {
        useCollapsedImageGallery.mockReturnValue({
            imageData: {
                products: {
                    items: [
                        {
                            id: 1,
                            thumbnail: {
                                label: 'Shoes',
                                url: 'https://venia.test/shoes.png'
                            }
                        }
                    ]
                }
            }
        });

        const tree = createTestInstance(<CollapsedImageGallery items={[1]} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('with remainder', () => {
        useCollapsedImageGallery.mockReturnValue({
            imageData: {
                products: {
                    items: [
                        {
                            id: 1,
                            thumbnail: {
                                label: 'Shoes',
                                url: 'https://venia.test/shoes.png'
                            }
                        }
                    ]
                }
            }
        });

        const tree = createTestInstance(
            <CollapsedImageGallery items={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
