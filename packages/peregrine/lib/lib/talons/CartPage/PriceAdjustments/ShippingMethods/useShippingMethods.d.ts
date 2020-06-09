export function useShippingMethods(props: any): {
    hasMethods: number;
    isShowingForm: boolean;
    selectedShippingFields: {
        country: string;
        region: string;
        zip: string;
    };
    selectedShippingMethod: string;
    shippingMethods: any[];
    showForm: () => void;
};
