import { useProductDetail } from '../useProductDetail';

const mockProduct = {
    name: 'Simple Product',
    sku: 'SP01',
    small_image: {
        url: 'https://test.cdn/image.jpg'
    }
};

const mockItem = {
    prices: {
        price: {
            currency: 'USD',
            value: 123.45
        }
    },
    quantity: 5
};

test('returns known stock status with all props', () => {
    const item = {
        ...mockItem,
        product: {
            ...mockProduct,
            stock_status: 'IN_STOCK'
        }
    };

    const talonProps = useProductDetail({ item });
    expect(talonProps).toMatchSnapshot();
});

test('returns unknown stock status', () => {
    const item = {
        ...mockItem,
        product: {
            ...mockProduct,
            stock_status: 'WOOF_WOOF'
        }
    };

    const talonProps = useProductDetail({ item });
    expect(talonProps.stockStatus).toEqual('Unknown');
});
