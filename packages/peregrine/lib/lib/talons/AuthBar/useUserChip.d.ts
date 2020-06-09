export function useUserChip(props: {
    showMyAccount: Function;
    user: object;
}): {
    display: string;
    email: string;
    handleClick: Function;
};
