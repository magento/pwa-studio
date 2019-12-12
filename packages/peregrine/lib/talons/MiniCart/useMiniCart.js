import { useCallback, useState } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';

export const useMiniCart = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const [cartState] = useCartContext();
    const [, { cancelCheckout }] = useCheckoutContext();

    const [isEditingItem, setIsEditingItem] = useState(false);
    const [step, setStep] = useState('cart');

    const { details, isLoading, isUpdatingItem } = cartState;
    // Cart state is not initialized until the cart is opened, so
    // destructuring needs to support this state being undefined
    const { items = [], prices = {} } = details;
    const { grand_total: grandTotal = {} } = prices;

    const shouldShowFooter =
        step === 'receipt' ||
        step === 'form' ||
        !((cartState.isEmpty && step === 'cart') || isLoading || isEditingItem);

    const isMiniCartMaskOpen = step === 'form';
    const isOpen = drawer === 'cart';

    const handleClose = useCallback(() => {
        setStep('cart');
        setIsEditingItem(false);
        closeDrawer();
    }, [closeDrawer, setStep]);

    const handleBeginEditItem = useCallback(() => {
        setIsEditingItem(true);
    }, []);

    const handleEndEditItem = useCallback(() => {
        setIsEditingItem(false);
    }, []);

    const handleDismiss = useCallback(() => {
        setStep('cart');
        cancelCheckout();
    }, [cancelCheckout]);

    return {
        cartItems: items,
        cartState,
        currencyCode: grandTotal.currency || 'USD',
        handleBeginEditItem,
        handleDismiss,
        handleEndEditItem,
        handleClose,
        isEditingItem,
        isLoading,
        isMiniCartMaskOpen,
        isOpen,
        isUpdatingItem,
        numItems: items.length,
        setStep,
        shouldShowFooter,
        step,
        subtotal: grandTotal.value
    };
};
