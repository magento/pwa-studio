export function useCarousel(images?: any[], startIndex?: number): ({
    activeItemIndex: number;
    sortedImages: any[];
} | {
    handlePrevious: () => void;
    handleNext: () => void;
    setActiveItemIndex: import("react").Dispatch<import("react").SetStateAction<number>>;
})[];
