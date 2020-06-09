export function useSuggestions(props: {
    filters: any;
    items: any;
    setVisible: Function;
    visible: boolean;
}): {
    categories: any;
    onNavigate: () => void;
    shouldRender: boolean;
};
