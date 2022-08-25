import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAddToCartDialog } from '@magento/peregrine/lib/talons/AddToCartDialog/useAddToCartDialog';

import AddToCartDialog from '../addToCartDialog';

jest.mock(
    '@magento/peregrine/lib/talons/AddToCartDialog/useAddToCartDialog',
    () => ({
        useAddToCartDialog: jest.fn()
    })
);

jest.mock('../../../classify');
jest.mock('../../Dialog', () => 'Dialog');
jest.mock('../../FormError', () => 'FormError');
jest.mock('../../Image', () => 'Image');
jest.mock('../../ProductOptions', () => 'Options');
jest.mock('../../Price', () => 'Price');

test('renders dialog without content', () => {
    useAddToCartDialog.mockReturnValue({
        formErrors: ['error1', 'error2'],
        isFetchingProductDetail: true,
        handleOnClose: jest.fn().mockName('handleOnClose')
    });

    const tree = createTestInstance(<AddToCartDialog />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders dialog with content', () => {
    useAddToCartDialog.mockReturnValue({
        buttonProps: {
            onClick: jest.fn().mockName('buttonProps.onClick')
        },
        configurableOptionProps: {
            options: ['option1', 'option2']
        },
        outOfStockVariants: [[55, 56], [31]],
        imageProps: {
            alt: 'image-label',
            src: 'https://example.com/media/image.jpg'
        },
        isFetchingProductDetail: false,
        handleOnClose: jest.fn().mockName('handleOnClose'),
        priceProps: {
            currency: 'USD',
            value: '123.45'
        }
    });

    const tree = createTestInstance(
        <AddToCartDialog item={{ product: { name: 'Configurable Product' } }} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
