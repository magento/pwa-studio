export function useCartOptions(props: any): {
    itemName: any;
    itemPrice: any;
    initialQuantity: any;
    handleCancel: () => void;
    handleSelectionChange: (optionId: any, selection: any) => void;
    handleUpdate: () => Promise<void>;
    handleValueChange: (value: any) => void;
    isUpdateDisabled: boolean;
};
