export function usePaymentsFormItems(props: any): {
    addressDiffers: boolean;
    handleCancel: () => void;
    handleError: () => void;
    handleSuccess: (value: any) => void;
    isDisabled: any;
    setIsReady: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
