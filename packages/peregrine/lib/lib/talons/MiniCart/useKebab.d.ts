export function useKebab(): {
    handleKebabClick: () => void;
    isOpen: boolean;
    kebabRef: import("react").MutableRefObject<any>;
};
