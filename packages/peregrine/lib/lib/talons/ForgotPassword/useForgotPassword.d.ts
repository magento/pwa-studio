export function useForgotPassword(props: any): {
    forgotPasswordEmail: any;
    handleContinue: () => void;
    handleFormSubmit: ({ email }: any) => Promise<void>;
    inProgress: boolean;
    isResettingPassword: any;
};
