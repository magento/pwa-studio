export function useSort(props?: {}): [{
    sortDirection: string;
    sortAttribute: string;
    sortText: string;
}, React.Dispatch<React.SetStateAction<{
    sortDirection: string;
    sortAttribute: string;
    sortText: string;
}>>];
