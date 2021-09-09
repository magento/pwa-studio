import { useCallback, useMemo, useState, useEffect } from 'react';
import { useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import debounce from 'lodash.debounce';

/**
 * This talon contains logic for a product quantity UI component.
 * It performs effects and returns prop data for rendering a component that lets you
 * modify the quantity of a cart item.
 *
 * This talon performs the following effects:
 *
 * - Updates the state of the quantity field when the initial value changes
 *
 * @function
 *
 * @param {Object} props
 * @param {number} props.initialValue the initial quantity value
 * @param {number} props.min the minimum allowed quantity value
 * @param {function} props.onChange change handler to invoke when quantity value changes
 *
 * @returns {QuantityTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';
 */
export const useQuantity = props => {
    const { initialValue, min, onChange } = props;

    const [prevQuantity, setPrevQuantity] = useState(initialValue);

    const quantityFieldApi = useFieldApi('quantity');
    const { value: quantity } = useFieldState('quantity');

    const isIncrementDisabled = useMemo(() => !quantity, [quantity]);

    // "min: 0" lets a user delete the value and enter a new one, but "1" is
    // actually the minimum value we allow to be set through decrement button.
    const isDecrementDisabled = useMemo(() => !quantity || quantity <= 1, [
        quantity
    ]);

    // Fire the onChange after some wait time. We calculate the current delay
    // as enough time for a user to spam inc/dec quantity but not enough time
    // for a user to click inc/dec on Product A and then click Product B.
    const debouncedOnChange = useMemo(
        () =>
            debounce(val => {
                setPrevQuantity(val);
                onChange(val);
            }, 350),
        [onChange]
    );

    const handleDecrement = useCallback(() => {
        const newQuantity = quantity - 1;
        quantityFieldApi.setValue(newQuantity);
        debouncedOnChange(newQuantity);
    }, [debouncedOnChange, quantity, quantityFieldApi]);

    const handleIncrement = useCallback(() => {
        const newQuantity = quantity + 1;
        quantityFieldApi.setValue(newQuantity);
        debouncedOnChange(newQuantity);
    }, [debouncedOnChange, quantity, quantityFieldApi]);

    const handleBlur = useCallback(() => {
        // Only submit the value change if it has changed.
        if (typeof quantity === 'number' && quantity != prevQuantity) {
            debouncedOnChange(quantity);
        }
    }, [debouncedOnChange, prevQuantity, quantity]);

    const maskInput = useCallback(
        value => {
            try {
                // For some storefronts decimal values are allowed.
                const nextVal = parseFloat(value);
                if (value && isNaN(nextVal))
                    throw new Error(`${value} is not a number.`);
                if (nextVal < min) return min;
                else return nextVal;
            } catch (err) {
                console.error(err);
                return prevQuantity;
            }
        },
        [min, prevQuantity]
    );

    /**
     * Everytime initialValue changes, update the quantity field state.
     */
    useEffect(() => {
        quantityFieldApi.setValue(initialValue);
    }, [initialValue, quantityFieldApi]);

    return {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    };
};

/** JSDoc type definitions */

/**
 * Object type returned by the {@link useQuantity} talon.
 * It provides props data for a quantity UI component.
 *
 * @typedef {Object} QuantityTalonProps
 *
 * @property {boolean} isDecrementDisabled True if decrementing should be disabled
 * @property {boolean} isIncrementDisabled True if incrementing should be disabled
 * @property {function} handleBlur Callback function for handling a blur event on a component
 * @property {function} handleDecrement Callback function for handling a quantity decrement event
 * @property {function} handleIncrement Callback function for handling an increment event
 * @property {function} maskInput Function for masking a value when decimal values are allowed
 */
