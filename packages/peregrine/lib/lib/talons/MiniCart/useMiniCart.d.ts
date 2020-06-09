export function useMiniCart(): {
    cartItems: any;
    cartState: any;
    currencyCode: any;
    handleBeginEditItem: () => void;
    handleDismiss: () => void;
    handleEndEditItem: () => void;
    handleClose: () => void;
    isEditingItem: boolean;
    isLoading: any;
    isMiniCartMaskOpen: boolean;
    isOpen: boolean;
    isUpdatingItem: any;
    numItems: any;
    setStep: import("react").Dispatch<import("react").SetStateAction<string>>;
    shouldShowFooter: boolean;
    step: string;
    subtotal: any;
};
