import gql from 'graphql-tag';
import { giftOptionsResolvers } from '../components/CartPage/PriceAdjustments/GiftOptions/giftOptions.gql';
import { paymentInformationResolvers } from '../components/CheckoutPage/PaymentInformation/paymentInformation.gql';
/**
 * Type resolvers are merged by the client so spread each resolver into a
 * separate object.
 *
 * NOTE: Be careful not to overwrite type properties. For example, suppose two
 * resolvers are spread into the array resulting in the following. "foo" will be
 * overwritten while "bar" and "baz" will not be.
 *
 * [
 *   { // From Component A resolvers
 *     Query: {
 *       foo: () => { return 1; }
 *       bar: () => { return 2; }
 *     }
 *   },
 *   { // From Component B resolvers
 *     Query: {
 *       foo: () => { return 3; }
 *       baz: () => { return 4; }
 *     }
 *   }
 * ]
 */
export const resolvers = [
    { ...paymentInformationResolvers },
    { ...giftOptionsResolvers }
];

// TODO: Would be good to be able to compose client side typedefs.
export const typeDefs = gql`
    extend type Query {
        cartId: ID!
    }
`;
