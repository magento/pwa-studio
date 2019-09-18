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

test('it returns a connected MiniCart component', () => {
    expect(Container.component).toBe(MiniCart);
    expect(Container.mapStateToProps).toBeInstanceOf(Function);
    expect(Container.mapDispatchToProps).toMatchObject({
        cancelCheckout: expect.any(Function),
        closeDrawer: expect.any(Function),
        removeItemFromCart: expect.any(Function),
        updateItemInCart: expect.any(Function)
    });
});

test('mapStateToProps returns the proper props', () => {
    const { mapStateToProps } = Container;

    const state = {
        cart: {
            details: {}
        },
        checkout: {},
        extra: 'extra'
    };

    const props = mapStateToProps(state);

    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        cart: expect.any(Object)
    });
});
