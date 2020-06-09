export function useCustomerForm(props: any): {
    handleCancel: () => void;
    handleSubmit: (formValues: any) => Promise<void>;
    hasDefaultShipping: boolean;
    initialValues: any;
    isLoading: boolean;
    isSaving: boolean;
    isUpdate: boolean;
};
