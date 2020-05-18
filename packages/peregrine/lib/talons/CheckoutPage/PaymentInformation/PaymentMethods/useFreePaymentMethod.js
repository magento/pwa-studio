import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '../../../../context/cart';

/**
 * @param {Function} props.setDoneEditing callback to display the summary when called with true.
 */
export const useFreePaymentMethod = props => {
    // TODO: Docs.
    // setDoneEditing(true) displays the "done" card
    const { mutations, setDoneEditing } = props;
    const { setPaymentMethodMutation } = mutations;

    const [{ cartId }] = useCartContext();
    const [setPaymentMethod] = useMutation(setPaymentMethodMutation);

    useEffect(() => {
        const setFree = async () => {
            // On mount set the payment method to free and then show the
            // summary. Ideally we would only call this mutation if the selected
            // method was not already "free", but adding that logic causes a
            // race condition with the "reset to editing" effect in the parent.
            await setPaymentMethod({
                variables: {
                    cartId,
                    method: {
                        code: 'free'
                    }
                }
            });
            setDoneEditing(true);
        };
        setFree();
    }, [cartId, setDoneEditing, setPaymentMethod]);
};
