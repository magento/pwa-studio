export const CREATE_CART: any;
export const PLACE_ORDER: any;
export const GET_ORDER_DETAILS: any;
export const GET_CHECKOUT_DETAILS: any;
export const GET_CUSTOMER: any;
declare namespace _default {
    export namespace mutations {
        export { CREATE_CART as createCartMutation };
        export { PLACE_ORDER as placeOrderMutation };
    }
    export namespace queries {
        export { GET_CHECKOUT_DETAILS as getCheckoutDetailsQuery };
        export { GET_CUSTOMER as getCustomerQuery };
        export { GET_ORDER_DETAILS as getOrderDetailsQuery };
    }
}
export default _default;
