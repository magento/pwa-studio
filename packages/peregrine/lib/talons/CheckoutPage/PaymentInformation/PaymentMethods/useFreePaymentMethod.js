import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '../../../../context/cart';

export const useFreePaymentMethod = props => {
    // TODO: Explain more.
    // setDoneEditing(true) displays the "done" card
    // onSubmit occurs when you click the review button (go to next step).
    const { mutations, onSubmit, setDoneEditing, shouldSubmit } = props;
    const { setPaymentMethodMutation } = mutations;

    const [{ cartId }] = useCartContext();
    const [setPaymentMethod] = useMutation(setPaymentMethodMutation);

    useEffect(() => {
        const setFree = async () => {
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

    useEffect(() => {
        if (shouldSubmit) {
            onSubmit();
        }
    }, [onSubmit, shouldSubmit]);
};
