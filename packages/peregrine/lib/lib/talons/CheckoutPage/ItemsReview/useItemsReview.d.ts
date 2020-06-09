export function useItemsReview(props: any): {
    isLoading: boolean;
    items: any;
    hasErrors: boolean;
    totalQuantity: number;
    showAllItems: boolean;
    setShowAllItems: () => void;
};
