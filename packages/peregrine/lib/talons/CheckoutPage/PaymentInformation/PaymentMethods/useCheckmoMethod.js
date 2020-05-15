import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '../../../../context/cart';

export const useCheckmoMethod = props => {
    // TODO: Explain more.
    // setDoneEditing(true) displays the "done" card
    // onSubmit occurs when you click the review button (go to next step).
    const { mutations, onSubmit, setDoneEditing, shouldSubmit } = props;
    const { setPaymentMethodMutation } = mutations;

    const [{ cartId }] = useCartContext();
    const [setPaymentMethod] = useMutation(setPaymentMethodMutation);

    useEffect(() => {
        const setCheckmo = async () => {
            await setPaymentMethod({
                variables: {
                    cartId,
                    method: {
                        code: 'checkmo'
                    }
                }
            });
            setDoneEditing(true);
        };
        setCheckmo();
    }, [cartId, setDoneEditing, setPaymentMethod]);

    useEffect(() => {
        if (shouldSubmit) {
            onSubmit();
        }
    }, [onSubmit, shouldSubmit]);
};
