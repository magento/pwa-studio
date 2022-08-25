/**
 *
 * @deprecated - use talons/QuantityStepper/useQuantityStepper instead
 *
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
export {
    useQuantityStepper as useQuantity
} from '../../QuantityStepper/useQuantityStepper';

/** JSDoc type definitions */

/**
 * Object type returned by the {@link useQuantityStepper} talon.
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
