export function useCartTrigger(props: any): {
    handleClick: () => Promise<void>;
    itemCount: any;
};
