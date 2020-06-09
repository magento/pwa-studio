export function useCategoryBranch(props: {
    category: {
        id: string;
        include_in_menu: boolean;
    };
    setCategoryId: Function;
}): {
    exclude: boolean;
    handleClick: Function;
};
