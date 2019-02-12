import actions from 'src/actions/checkoutReceipt';
import { continueShopping, createAccount } from 'src/actions/checkout';
import Container from '../receiptContainer';
import Receipt from '../receipt';

jest.mock('src/drivers', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(component => ({
            component,
            mapStateToProps,
            mapDispatchToProps
        }))
    )
}));

test('returns a connected Receipt component', () => {
    expect(Container.component).toBe(Receipt);
    expect(Container.mapStateToProps).toBeInstanceOf(Function);
    expect(Container.mapDispatchToProps).toMatchObject({
        continueShopping,
        createAccount,
        reset: actions.reset
    });
});

test('mapStateToProps correctly maps state to props', () => {
    const { mapStateToProps } = Container;

    const state = {
        checkoutReceipt: {
            order: {
                billing_address: {
                    email: 'email',
                    firstname: 'firstname',
                    lastname: 'lastname'
                }
            }
        },
        extra: 'extra'
    };

    const props = mapStateToProps(state);
    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        order: {
            billing_address: {
                email: state.checkoutReceipt.order.billing_address.email,
                firstname:
                    state.checkoutReceipt.order.billing_address.firstname,
                lastname: state.checkoutReceipt.order.billing_address.lastname
            }
        }
    });
});
