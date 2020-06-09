export function useAuthBar(props: {
    disabled: boolean;
    showMyAccount: Function;
    showSignIn: Function;
}): {
    currentUser: object;
    handleShowMyAccount: Function;
    handleSignIn: Function;
    isSignedIn: boolean;
    isSignInDisabled: boolean;
};
