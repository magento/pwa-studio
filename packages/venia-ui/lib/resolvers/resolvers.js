import { giftOptionsResolvers } from '../components/CartPage/PriceAdjustments';
import { checkoutPageResolvers } from '../components/CheckoutPage/checkoutPage';

export default {
    Query: {
        ...checkoutPageResolvers.Query,
        ...giftOptionsResolvers.Query
    },
    Mutation: {
        ...checkoutPageResolvers.Mutation,
        ...giftOptionsResolvers.Mutation
    }
};
