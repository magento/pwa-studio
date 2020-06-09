export const GET_SHIPPING_INFORMATION: any;
export const GET_DEFAULT_SHIPPING: any;
export const SET_CUSTOMER_ADDRESS_ON_CART: any;
declare namespace _default {
    export namespace mutations {
        export { SET_CUSTOMER_ADDRESS_ON_CART as setDefaultAddressOnCartMutation };
    }
    export namespace queries {
        export { GET_DEFAULT_SHIPPING as getDefaultShippingQuery };
        export { GET_SHIPPING_INFORMATION as getShippingInformationQuery };
    }
}
export default _default;
