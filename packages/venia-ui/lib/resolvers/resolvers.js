import { giftOptionsResolvers } from '../components/CartPage/PriceAdjustments';
import { checkoutPageResolvers } from '../components/CheckoutPage/checkoutPage.gql';

export default {
    Query: {
        ...giftOptionsResolvers.Query
    },
    Mutation: {
        ...giftOptionsResolvers.Mutation
    },
    // TODO: Is this safe? Apparently you can have `Type` resolvers. Not sure if
    // checkoutPageResolvers.Query would overwrite giftOptionsResolvers.
    ...checkoutPageResolvers
};
