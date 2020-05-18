const paymentErrorMessage =
    'Unable to place order: Transaction has been declined. Please try again later.';

class CheckoutError extends Error {
    constructor(gqlError, ...params) {
        super(params);
        this.name = 'CheckoutError';
        this.message = gqlError.message;
        this.error = gqlError;
    }

    isPaymentInfoError = () => {
        return this.paymentHasExpired();
    };

    hasPaymentExpired = () => {
        /**
         * TODO
         *
         * This is temp stuff, need to have a better check.
         */
        return this.error.graphQLErrors.map(({ message }) =>
            message.includes(paymentErrorMessage)
        )[0];
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
