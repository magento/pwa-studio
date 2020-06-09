export const GET_IS_BILLING_ADDRESS_SAME: any;
export const GET_PAYMENT_NONCE: any;
export const GET_BILLING_ADDRESS: any;
export const GET_SHIPPING_ADDRESS: any;
export const SET_BILLING_ADDRESS: any;
export const SET_CC_DETAILS_ON_CART: any;
declare namespace _default {
    export namespace queries {
        export { GET_BILLING_ADDRESS as getBillingAddressQuery };
        export { GET_IS_BILLING_ADDRESS_SAME as getIsBillingAddressSameQuery };
        export { GET_PAYMENT_NONCE as getPaymentNonceQuery };
        export { GET_SHIPPING_ADDRESS as getShippingAddressQuery };
    }
    export namespace mutations {
        export { SET_BILLING_ADDRESS as setBillingAddressMutation };
        export { SET_CC_DETAILS_ON_CART as setCreditCardDetailsOnCartMutation };
    }
}
export default _default;
