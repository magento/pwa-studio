import {
    beginCheckout,
    cancelCheckout,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
} from '../../../actions/checkout';

import ConnectedCheckoutContainer from '../index';

jest.mock('../../../classify');
jest.mock('@magento/venia-drivers', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(component => ({
            component,
            mapStateToProps,
            mapDispatchToProps
        }))
    ),
    withRouter: component => {
        component.defaultProps = {
            ...component.defaultProps,
            router: { pathname: 'mocked-path' }
        };
        return component;
    }
}));

test('returns a connected CheckoutContainer component', () => {
    expect(ConnectedCheckoutContainer.component).toBeInstanceOf(Function);
    expect(ConnectedCheckoutContainer.mapStateToProps).toBeInstanceOf(Function);
    expect(ConnectedCheckoutContainer.mapDispatchToProps).toMatchObject({
        beginCheckout,
        cancelCheckout,
        submitShippingAddress,
        submitOrder,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod
    });
});

test('mapStateToProps correctly maps state to props', () => {
    const { mapStateToProps } = ConnectedCheckoutContainer;

    const state = {
        cart: {},
        checkout: {},
        directory: {},
        extra: 'extra'
    };

    const props = mapStateToProps(state);
    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        cart: state.cart,
        checkout: state.checkout,
        directory: state.directory
    });
});
