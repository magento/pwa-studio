/**
 * Other checkout place order mutation errors can include
 * the following list:
 *
 * https://devdocs.magento.com/guides/v2.3/graphql/mutations/place-order.html#errors
 */

const paymentErrorMessage =
    'Unable to place order: Transaction has been declined. Please try again later.';

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
            message.includes(paymentErrorMessage)
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
