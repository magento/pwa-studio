import {
    createAccount,
    resetReceipt
} from '@magento/peregrine/lib/store/actions/checkout';
import Container from '../receiptContainer';
import Receipt from '../receipt';

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

test('returns a connected Receipt component', () => {
    expect(Container.component).toBe(Receipt);
    expect(Container.mapStateToProps).toBeInstanceOf(Function);
    expect(Container.mapDispatchToProps).toMatchObject({
        createAccount,
        reset: resetReceipt
    });
});

test('mapStateToProps correctly maps state to props', () => {
    const { mapStateToProps } = Container;

    const state = {
        checkout: {
            receipt: {
                order: {
                    billing_address: {
                        email: 'email',
                        firstname: 'firstname',
                        lastname: 'lastname'
                    }
                }
            }
        },
        app: {
            drawer: null
        },
        extra: 'extra'
    };

    const props = mapStateToProps(state);
    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        order: {
            billing_address: {
                email: state.checkout.receipt.order.billing_address.email,
                firstname:
                    state.checkout.receipt.order.billing_address.firstname,
                lastname: state.checkout.receipt.order.billing_address.lastname
            }
        }
    });
});
