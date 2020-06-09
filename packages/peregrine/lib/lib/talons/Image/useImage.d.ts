export const UNCONSTRAINED_SIZE_KEY: "default";
export function useImage(props: any): {
    handleError: () => void;
    handleImageLoad: () => void;
    hasError: boolean;
    isLoaded: boolean;
    resourceWidth: any;
    resourceHeight: any;
};
