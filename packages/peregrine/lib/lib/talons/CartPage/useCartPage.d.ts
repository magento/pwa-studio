export function useCartPage(props: any): {
    hasItems: boolean;
    handleSignIn: () => void;
    isSignedIn: any;
    isCartUpdating: boolean;
    setIsCartUpdating: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
