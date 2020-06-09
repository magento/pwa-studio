export default useGiftOptions;
declare function useGiftOptions(props: any): {
    includeGiftReceipt: boolean;
    includePrintedCard: boolean;
    giftMessage: string;
    toggleIncludeGiftReceiptFlag: () => void;
    toggleIncludePrintedCardFlag: () => void;
    updateGiftMessage: (e: any) => void;
};
