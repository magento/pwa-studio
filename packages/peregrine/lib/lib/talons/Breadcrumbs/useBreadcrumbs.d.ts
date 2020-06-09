export function useBreadcrumbs(props: {
    query: object;
    categoryId: string;
}): {
    currentCategory: string;
    currentCategoryPath: string;
    isLoading: boolean;
    normalizedData: any[];
};
