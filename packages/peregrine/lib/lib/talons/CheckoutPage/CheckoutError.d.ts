export default CheckoutError;
declare class CheckoutError extends Error {
    constructor(gqlError: any, ...params: any[]);
    error: any;
    hasPaymentExpired: () => any;
}
