export const CREATE_CUSTOMER_ADDRESS_MUTATION: any;
/**
 * We would normally use the CustomerAddressFragment here for the response
 * but due to GraphQL returning null region data, we return minimal data and
 * rely on refetching after performing this mutation to get accurate data.
 *
 * Fragment will be added back after MC-33948 is resolved.
 */
export const UPDATE_CUSTOMER_ADDRESS_MUTATION: any;
export const GET_CUSTOMER_QUERY: any;
declare namespace _default {
    export namespace mutations {
        export { CREATE_CUSTOMER_ADDRESS_MUTATION as createCustomerAddressMutation };
        export { UPDATE_CUSTOMER_ADDRESS_MUTATION as updateCustomerAddressMutation };
    }
    export namespace queries {
        export { GET_CUSTOMER_QUERY as getCustomerQuery };
        export { GET_CUSTOMER_ADDRESSES as getCustomerAddressesQuery };
        export { GET_DEFAULT_SHIPPING as getDefaultShippingQuery };
    }
}
export default _default;
import { GET_CUSTOMER_ADDRESSES } from "../../AddressBook/addressBook.gql";
import { GET_DEFAULT_SHIPPING } from "../shippingInformation.gql";
