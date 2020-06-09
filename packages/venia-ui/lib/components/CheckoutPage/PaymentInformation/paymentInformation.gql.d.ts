export const AvailablePaymentMethodsFragment: any;
export const GET_PAYMENT_INFORMATION: any;
export const GET_PAYMENT_NONCE: any;
export const SET_BILLING_ADDRESS: any;
export const SET_FREE_PAYMENT_METHOD_ON_CART: any;
export namespace paymentInformationResolvers {
    export namespace Cart {
        export function paymentNonce(cart: any, _: any, { cache }: {
            cache: any;
        }): any;
        export function isBillingAddressSame(cart: any, _: any, { cache }: {
            cache: any;
        }): any;
    }
}
declare namespace _default {
    export namespace queries {
        export { GET_PAYMENT_NONCE as getPaymentNonceQuery };
        export { GET_PAYMENT_INFORMATION as getPaymentInformation };
    }
    export namespace mutations {
        export { SET_BILLING_ADDRESS as setBillingAddressMutation };
        export { SET_FREE_PAYMENT_METHOD_ON_CART as setFreePaymentMethodMutation };
    }
}
export default _default;
