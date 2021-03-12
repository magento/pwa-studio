import CheckoutError from '../CheckoutError';
import { PAYMENT_ERROR } from '../PlaceOrderErrors';

test('Should return the correct property values', () => {
    const gqlError = new Error('GraphQL error: Something bad happened!');

    gqlError.graphQLErrors = [new Error('Something bad')];

    const checkoutError = new CheckoutError(gqlError);

    const { name, message, error } = checkoutError;

    expect(name).toEqual('CheckoutError');

    expect(message).toEqual(' Something bad happened!');

    expect(error).toStrictEqual(gqlError);

    expect(checkoutError.hasPaymentExpired()).toBeFalsy();
});

test('Should indicate expired payment error', () => {
    const gqlError = new Error('GraphQL error: Something bad happened!');

    gqlError.graphQLErrors = [new Error(PAYMENT_ERROR)];

    const checkoutError = new CheckoutError(gqlError);

    expect(checkoutError.hasPaymentExpired()).toBeTruthy();
});
