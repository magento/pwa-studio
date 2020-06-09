export function useProduct(props: any): {
    handleEditItem: () => void;
    handleFavoriteItem: () => void;
    handleRemoveItem: () => void;
    isFavorite: boolean;
    isLoading: boolean;
    productImage: any;
    productName: any;
    productOptions: any;
    productPrice: any;
    productQuantity: any;
};
