declare namespace _default {
    export namespace mutations {
        export { SET_GIFT_OPTIONS as setGiftOptionsMutation };
    }
    export namespace queries {
        export { GET_GIFT_OPTIONS as getGiftOptionsQuery };
    }
}
export default _default;
export namespace giftOptionsResolvers {
    export namespace Query {
        export function gift_options(_: any, { cart_id }: {
            cart_id: any;
        }, { cache, getCacheKey }: {
            cache: any;
            getCacheKey: any;
        }): {
            __typename: string;
            include_gift_receipt: any;
            include_printed_card: any;
            gift_message: any;
        };
    }
    export namespace Mutation {
        export function set_gift_options(_: any, { cart_id, include_gift_receipt, include_printed_card, gift_message }: {
            cart_id: any;
            include_gift_receipt?: boolean;
            include_printed_card?: boolean;
            gift_message?: string;
        }, { cache }: {
            cache: any;
        }): any;
    }
}
/**
 * Local mutation. GQL support is not available as of today.
 *
 * Once available, we can change the mutation to match the schema.
 */
declare const SET_GIFT_OPTIONS: any;
/**
 * Local query. GQL support is not available as of today.
 *
 * Once available, we can change the query to match the schema.
 */
declare const GET_GIFT_OPTIONS: any;
