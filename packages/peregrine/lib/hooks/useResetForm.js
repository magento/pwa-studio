import { useCallback } from 'react';
import { useFormApi } from 'informed';

/**
 * This hook takes a callback 'onClick' prop and
 * returns another callback function that calls form.reset
 * before invoking the onClick prop function.
 *
 * @param {object}      props
 * @param {function}    props.onClick
 *
 * @returns {object}    result
 * @returns {function}  result.handleClick
 */
export const useResetForm = props => {
    const { onClick } = props;

    const formApi = useFormApi();

    const handleClick = useCallback(() => {
        formApi.reset();
        onClick();
    }, [formApi, onClick]);

    return {
        handleClick
    };
};
