import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';

export const useCheckoutPage = () => {
    const [{ isSignedIn }] = useUserContext();
    const [{ isEmpty }] = useCartContext();

    return [
        { isGuestCheckout: !isSignedIn, isCartEmpty: isEmpty },
        {
            handleSignIn: () => {
                console.log('Signing in');
            }
        }
    ];
};
