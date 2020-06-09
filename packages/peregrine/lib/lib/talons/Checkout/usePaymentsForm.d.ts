export function usePaymentsForm(props: any): {
    handleSubmit: () => void;
    initialValues: any;
    isSubmitting: boolean;
    setIsSubmitting: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
