export function useProduct(props: any): {
    handleEditItem: () => void;
    handleRemoveFromCart: () => Promise<void>;
    handleToggleFavorites: () => void;
    handleUpdateItemQuantity: (quantity: any) => Promise<void>;
    isEditable: boolean;
    isFavorite: boolean;
    product: {
        currency: any;
        image: any;
        name: any;
        options: any;
        quantity: any;
        unitPrice: any;
    };
    updateItemErrorMessage: string;
};
