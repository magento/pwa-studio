import { giftOptionsResolvers } from '../components/CartPage/PriceAdjustments';

export default {
    Query: {
        ...giftOptionsResolvers.Query
    },
    Mutation: {
        ...giftOptionsResolvers.Mutation
    }
};
