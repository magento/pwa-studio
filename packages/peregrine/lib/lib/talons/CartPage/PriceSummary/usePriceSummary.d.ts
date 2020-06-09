export function usePriceSummary(props: any): {
    handleProceedToCheckout: () => void;
    hasError: boolean;
    hasItems: boolean;
    isCheckout: boolean;
    isLoading: boolean;
    flatData: {
        subtotal?: undefined;
        total?: undefined;
        discounts?: undefined;
        giftCards?: undefined;
        taxes?: undefined;
        shipping?: undefined;
    } | {
        subtotal: any;
        total: any;
        discounts: any;
        giftCards: any;
        taxes: any;
        shipping: any;
    };
};
