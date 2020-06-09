export function useSuggestedCategory(props: {
    categoryId: string;
    onNavigate: Function;
    searchValue: string;
}): {
    destination: {
        pathname: string;
        search: string;
    };
    handleClick: () => void;
};
