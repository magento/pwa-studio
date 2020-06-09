export namespace MOCKED_ADDRESS {
    export const city: string;
    export const firstname: string;
    export const lastname: string;
    export const street: string[];
    export const telephone: string;
}
export function useShippingForm(props: any): {
    handleOnSubmit: (formValues: any) => void;
    handleZipChange: (zip: any) => void;
    isSetShippingLoading: boolean;
};
