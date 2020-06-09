export function useEditableForm(props: any): {
    handleCancel: () => void;
    handleSubmitAddressForm: () => void;
    handleSubmitPaymentsForm: (formValues: any) => Promise<void>;
    handleSubmitShippingForm: (formValues: any) => Promise<void>;
};
