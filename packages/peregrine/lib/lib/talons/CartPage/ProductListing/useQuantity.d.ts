export function useQuantity(props: any): {
    isDecrementDisabled: boolean;
    isIncrementDisabled: boolean;
    handleBlur: () => void;
    handleDecrement: () => void;
    handleIncrement: () => void;
    maskInput: (value: any) => any;
};
