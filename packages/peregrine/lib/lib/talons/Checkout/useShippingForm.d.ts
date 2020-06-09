export function useShippingForm(props: {
    availableShippingMethods: any[];
}): {
    handleCancel: Function;
    handleSubmit: Function;
    initialValue: object;
    selectableShippingMethods: any[];
};
