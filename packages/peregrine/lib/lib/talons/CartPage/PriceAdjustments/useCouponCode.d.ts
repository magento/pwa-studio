export function useCouponCode(props: any): {
    applyError: string;
    applyingCoupon: boolean;
    data: any;
    fetchError: import("apollo-client").ApolloError;
    handleApplyCoupon: ({ couponCode }: any) => Promise<void>;
    handleRemoveCoupon: (couponCode: any) => Promise<void>;
    removingCoupon: boolean;
};
