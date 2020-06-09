export function usePagination(props: any): {
    handleLeftSkip: () => void;
    handleRightSkip: () => void;
    handleNavBack: () => void;
    handleNavForward: () => void;
    isActiveLeft: boolean;
    isActiveRight: boolean;
    tiles: number[];
};
