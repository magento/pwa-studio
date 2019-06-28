import Container from '../container';
import MiniCart from '../miniCart';

jest.mock('../miniCart');
jest.mock('@magento/venia-drivers', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(component => ({
            component,
            mapStateToProps,
            mapDispatchToProps
        }))
    )
}));
jest.mock('../../../selectors/cart', () => ({
    isEmptyCartVisible: jest.fn(() => true),
    isMiniCartMaskOpen: jest.fn(() => true)
}));

test('it returns a connected MiniCart component', () => {
    expect(Container.component).toBe(MiniCart);
    expect(Container.mapStateToProps).toBeInstanceOf(Function);
    expect(Container.mapDispatchToProps).toMatchObject({
        beginEditItem: expect.any(Function),
        cancelCheckout: expect.any(Function),
        closeDrawer: expect.any(Function),
        endEditItem: expect.any(Function),
        removeItemFromCart: expect.any(Function),
        updateItemInCart: expect.any(Function)
    });
});

test('mapStateToProps returns the proper props', () => {
    const { mapStateToProps } = Container;

    const state = {
        cart: {},
        checkout: { step: 'cart' },
        extra: 'extra'
    };

    const props = mapStateToProps(state);

    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        cart: expect.any(Object),
        isCartEmpty: expect.any(Boolean),
        isMiniCartMaskOpen: expect.any(Boolean)
    });
});
