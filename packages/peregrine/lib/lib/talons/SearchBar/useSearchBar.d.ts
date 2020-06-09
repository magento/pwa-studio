export function useSearchBar(): {
    containerRef: any;
    expanded: any;
    handleChange: (value: any) => void;
    handleFocus: () => void;
    handleSubmit: ({ search_query }: any) => void;
    initialValues: {
        search_query: string;
    };
    setExpanded: any;
    setValid: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    valid: boolean;
};
