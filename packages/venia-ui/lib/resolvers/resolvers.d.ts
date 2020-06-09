declare var _default: ({
    Cart: {
        paymentNonce: (cart: any, _: any, { cache }: {
            cache: any;
        }) => any;
        isBillingAddressSame: (cart: any, _: any, { cache }: {
            cache: any;
        }) => any;
    };
} | {
    Query: {
        gift_options: (_: any, { cart_id }: {
            cart_id: any;
        }, { cache, getCacheKey }: {
            cache: any;
            getCacheKey: any;
        }) => {
            __typename: string;
            include_gift_receipt: any;
            include_printed_card: any;
            gift_message: any;
        };
    };
    Mutation: {
        set_gift_options: (_: any, { cart_id, include_gift_receipt, include_printed_card, gift_message }: {
            cart_id: any;
            include_gift_receipt?: boolean;
            include_printed_card?: boolean;
            gift_message?: string;
        }, { cache }: {
            cache: any;
        }) => any;
    };
})[];
export default _default;
