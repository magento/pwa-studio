export function useAutocomplete(props: {
    query: DocumentNode;
    valid: boolean;
    visible: boolean;
}): {
    displayResult: any;
    filters: any;
    messageType: string;
    products: any;
    resultCount: any;
    value: import("informed").FormValue<{}>;
};
export type DocumentNode = any;
