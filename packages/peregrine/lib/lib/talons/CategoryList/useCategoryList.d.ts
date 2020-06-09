export function useCategoryList(props: {
    query: object;
    id: string;
}): {
    childCategories: any[];
    error: object;
};
