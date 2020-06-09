export function useFlow(props: any): {
    cartState: any;
    checkoutDisabled: any;
    checkoutState: any;
    isReady: boolean;
    submitPaymentMethodAndBillingAddress: any;
    submitShippingMethod: any;
    handleBeginCheckout: () => Promise<void>;
    handleCancelCheckout: () => Promise<void>;
    handleCloseReceipt: () => void;
    handleSubmitOrder: () => Promise<void>;
};
