export function usePaymentMethods(props: any): {
    availablePaymentMethods: any;
    currentSelectedPaymentMethod: import("informed").FormValue<{}>;
    initialSelectedMethod: any;
    isLoading: boolean;
};
