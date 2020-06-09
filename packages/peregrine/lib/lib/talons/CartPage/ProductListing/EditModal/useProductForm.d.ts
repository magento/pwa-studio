export function useProductForm(props: any): {
    configItem: any;
    handleOptionSelection: (optionId: any, selection: any) => void;
    handleSubmit: (formValues: any) => Promise<void>;
    isLoading: boolean;
    isSaving: boolean;
    setFormApi: import("react").Dispatch<(prevState: undefined) => undefined>;
};
