export function useAddressForm(props: {
    fields: any[];
    onCancel: Function;
    onSubmit: Function;
}): {
    handleCancel: Function;
    handleSubmit: Function;
    initialValues: object;
};
