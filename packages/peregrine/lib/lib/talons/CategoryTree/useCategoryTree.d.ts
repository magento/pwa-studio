export function useCategoryTree(props: {
    categories: object;
    categoryId: number;
    query: DocumentNode;
    updateCategories: Function;
}): {
    childCategories: Map<number, CategoryNode>;
};
export type CategoryNode = {
    /**
     * - category data
     */
    category: object;
    /**
     * - true if the category has no children
     */
    isLeaf: boolean;
};
export type DocumentNode = any;
