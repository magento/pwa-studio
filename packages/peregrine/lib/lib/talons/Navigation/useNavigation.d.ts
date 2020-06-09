export function useNavigation(props: any): {
    catalogActions: any;
    categories: any;
    categoryId: any;
    handleBack: () => void;
    handleClose: () => void;
    hasModal: boolean;
    isOpen: boolean;
    isTopLevel: boolean;
    setCategoryId: import("react").Dispatch<any>;
    showCreateAccount: () => void;
    showForgotPassword: () => void;
    showMainMenu: () => void;
    showMyAccount: () => void;
    showSignIn: () => void;
    view: string;
};
