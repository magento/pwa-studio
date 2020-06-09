export function useAddressBook(props: any): {
    activeAddress: undefined;
    customerAddresses: any;
    isLoading: boolean;
    handleAddAddress: () => void;
    handleApplyAddress: () => Promise<void>;
    handleCancel: () => void;
    handleSelectAddress: (addressId: any) => void;
    handleEditAddress: (address: any) => void;
    selectedAddress: undefined;
};
