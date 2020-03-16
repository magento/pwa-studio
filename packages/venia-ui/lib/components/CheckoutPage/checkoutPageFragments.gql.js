import gql from 'graphql-tag';
// # The current checkout step, stored locally for persistence.
//         # TODO: Why does enabling this cause data to return null?!?
//         # checkoutStep @client
//         # If total quantity is falsy we render empty.
export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id

        total_quantity
    }
`;
