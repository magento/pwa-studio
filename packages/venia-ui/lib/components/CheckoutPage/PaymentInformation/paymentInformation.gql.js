import gql from 'graphql-tag';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */
export const GET_PAYMENT_INFORMATION = gql`
    query getPaymentInformation($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            prices {
                grand_total {
                    value
                }
            }
            available_payment_methods {
                code
                title
            }
            selected_payment_method {
                code
            }
            shipping_addresses {
                firstname
                lastname
                street
                city
                region {
                    code
                }
                postcode
                country {
                    code
                }
                telephone
            }
        }
    }
`;
/* eslint-enable graphql/template-strings */

export const SET_BILLING_ADDRESS = gql`
    mutation setBillingAddress(
        $cartId: String!
        $firstname: String!
        $lastname: String!
        $street: [String]!
        $city: String!
        $regionCode: String!
        $postcode: String!
        $countryCode: String!
        $telephone: String!
    ) {
        setBillingAddressOnCart(
            input: {
                cart_id: $cartId
                billing_address: {
                    address: {
                        firstname: $firstname
                        lastname: $lastname
                        street: $street
                        city: $city
                        region: $regionCode
                        postcode: $postcode
                        country_code: $countryCode
                        telephone: $telephone
                        save_in_address_book: false
                    }
                }
            }
        ) @connection(key: "setBillingAddressOnCart") {
            cart {
                id
                billing_address {
                    firstname
                    lastname
                    country {
                        code
                    }
                    street
                    city
                    region {
                        code
                    }
                    postcode
                    telephone
                }
            }
        }
    }
`;

// Sets the provided payment method object on the cart.
export const SET_FREE_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "free" } }
        ) @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export const paymentInformationResolvers = {
    Cart: {
        paymentNonce: (cart, _, { cache }) => {
            try {
                const cacheData = cache.readQuery({
                    query: GET_PAYMENT_NONCE
                });
                return cacheData.cart.paymentNonce || null;
            } catch (err) {
                // Normally you can rely on apollo's built-in behavior to
                // resolve @client directives, but _only_ if you init the cache.
                // This resolver and try-catch are just another way to handle
                // not having initialized cache.
                // See https://www.apollographql.com/docs/react/data/local-state/#querying-local-state
                return null;
            }
        },
        isBillingAddressSame: (cart, _, { cache }) => {
            try {
                const cacheData = cache.readQuery({
                    query: GET_IS_BILLING_ADDRESS_SAME
                });
                return cacheData.cart.isBillingAddressSame || true;
            } catch (err) {
                // Normally you can rely on apollo's built-in behavior to
                // resolve @client directives, but _only_ if you init the cache.
                // This resolver and try-catch are just another way to handle
                // not having initialized cache.
                // See https://www.apollographql.com/docs/react/data/local-state/#querying-local-state
                return true;
            }
        }
    }
};

export default {
    queries: {
        getPaymentInformation: GET_PAYMENT_INFORMATION
    },
    mutations: {
        setBillingAddressMutation: SET_BILLING_ADDRESS,
        setFreePaymentMethodMutation: SET_FREE_PAYMENT_METHOD_ON_CART
    }
};
