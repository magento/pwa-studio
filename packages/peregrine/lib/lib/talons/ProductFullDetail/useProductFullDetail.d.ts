export function useProductFullDetail(props: any): {
    breadcrumbCategoryId: any;
    handleAddToCart: () => Promise<void>;
    handleSelectionChange: (optionId: any, selection: any) => void;
    handleSetQuantity: (value: any) => void;
    isAddToCartDisabled: any;
    mediaGalleryEntries: any;
    productDetails: {
        description: any;
        name: any;
        price: any;
        sku: any;
    };
    quantity: number;
};
