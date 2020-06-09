export function useSignIn(props: any): {
    errors: any[];
    handleCreateAccount: () => void;
    handleForgotPassword: () => void;
    handleSubmit: ({ email, password }: any) => Promise<void>;
    isBusy: any;
    setFormApi: (api: any) => any;
};
