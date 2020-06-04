import { PAYMENT_ERROR } from './PlaceOrderErrors';

const removeGQLTag = rawMessage => rawMessage.replace(/GraphQL error:/, '');

class CheckoutError extends Error {
    constructor(gqlError, ...params) {
        super(params);
        this.name = 'CheckoutError';
        this.message = removeGQLTag(gqlError.message);
        this.error = gqlError;
    }

    hasPaymentExpired = () => {
        return this.error.graphQLErrors.some(({ message }) =>
            message.includes(PAYMENT_ERROR)
        );
    };

    /**
     * TODO have similar functions if needed for
     * shipping information and shipping method
     * so when they do
     *
     * ```es6
     * if (error.isShippingInformationError()) {
     *      // Handle the error
     * } else {
     *      // Not needed, probably error for other component to handle
     * }
     * ```
     */
}

export default CheckoutError;
