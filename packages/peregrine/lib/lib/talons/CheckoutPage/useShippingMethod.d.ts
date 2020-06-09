export namespace displayStates {
    export const DONE: string;
    export const EDITING: string;
    export const INITIALIZING: string;
}
export function useShippingMethod(props: any): {
    displayState: string;
    handleCancelUpdate: () => void;
    handleSubmit: (value: any) => Promise<void>;
    isLoading: boolean;
    isUpdateMode: boolean;
    selectedShippingMethod: any;
    shippingMethods: any[];
    showUpdateMode: () => void;
};
