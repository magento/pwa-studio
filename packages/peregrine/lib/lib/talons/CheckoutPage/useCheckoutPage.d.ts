export namespace CHECKOUT_STEP {
    export const SHIPPING_ADDRESS: number;
    export const SHIPPING_METHOD: number;
    export const PAYMENT: number;
    export const REVIEW: number;
}
export function useCheckoutPage(props: any): {
    activeContent: string;
    checkoutStep: number;
    error: CheckoutError;
    customer: any;
    handleSignIn: () => void;
    handlePlaceOrder: () => Promise<void>;
    hasError: boolean;
    isCartEmpty: boolean;
    isGuestCheckout: boolean;
    isLoading: boolean;
    isUpdating: boolean;
    orderDetailsData: any;
    orderDetailsLoading: boolean;
    orderNumber: any;
    placeOrderLoading: boolean;
    setCheckoutStep: import("react").Dispatch<import("react").SetStateAction<number>>;
    setIsUpdating: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setShippingInformationDone: () => void;
    setShippingMethodDone: () => void;
    setPaymentInformationDone: () => void;
    resetReviewOrderButtonClicked: () => void;
    handleReviewOrder: () => void;
    reviewOrderButtonClicked: boolean;
    toggleActiveContent: () => void;
};
import CheckoutError from "./CheckoutError";
