export function useAuthModal(props: {
    closeDrawer: Function;
    showCreateAccount: Function;
    showForgotPassword: Function;
    showMainMenu: Function;
    showMyAccount: Function;
}): {
    handleClose: Function;
    handleCreateAccount: Function;
    handleSignOut: Function;
    setUsername: Function;
    showCreateAccount: Function;
    showForgotPassword: Function;
    showMyAccount: Function;
    username: string;
};
