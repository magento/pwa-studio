export function useSearchPage(props: {
    query: string;
}): {
    data: any;
    error: import("apollo-client").ApolloError;
    filters: any;
    loading: boolean;
    openDrawer: () => void;
    pageControl: {
        currentPage: any;
        setPage: any;
        totalPages: any;
    };
    sortProps: [{
        sortDirection: string;
        sortAttribute: string;
        sortText: string;
    }, import("react").Dispatch<import("react").SetStateAction<{
        sortDirection: string;
        sortAttribute: string;
        sortText: string;
    }>>];
};
