export const GET_CUSTOMER_ADDRESSES: any;
export const GET_CUSTOMER_CART_ADDRESS: any;
declare namespace _default {
    export namespace mutations {
        export { SET_CUSTOMER_ADDRESS_ON_CART as setCustomerAddressOnCartMutation };
    }
    export namespace queries {
        export { GET_CUSTOMER_ADDRESSES as getCustomerAddressesQuery };
        export { GET_CUSTOMER_CART_ADDRESS as getCustomerCartAddressQuery };
    }
}
export default _default;
import { SET_CUSTOMER_ADDRESS_ON_CART } from "../ShippingInformation/shippingInformation.gql";
