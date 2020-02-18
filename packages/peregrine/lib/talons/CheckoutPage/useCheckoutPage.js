import { useUserContext } from '../../context/user';

export const useCheckoutPage = () => {
    const [{ isSignedIn }] = useUserContext();

    return [
        { isGuestCheckout: !isSignedIn },
        {
            handleSignIn: () => {
                console.log('Signing in');
            }
        }
    ];
};
