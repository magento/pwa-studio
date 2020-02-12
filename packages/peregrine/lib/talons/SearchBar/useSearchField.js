import { useCallback, useEffect, useRef } from 'react';
import { useFieldState, useFormApi } from 'informed';

import { useSearchParam } from '../../hooks/useSearchParam';
import { useAppContext } from '../../context/app';

/**
 * Returns props necessary to render a SearchField component.
 *
 * @param {Object} props
 * @param {Object} props.location
 * @param {Function} props.onChange
 */
export const useSearchField = props => {
    const { location, onChange } = props;

    const [{ searchOpen }] = useAppContext();
    const inputRef = useRef();

    const { value } = useFieldState('search_query');
    const formApi = useFormApi();

    const setValue = useCallback(
        nextValue => {
            // update the search field
            if (nextValue) {
                formApi.setValue('search_query', nextValue);
            }

            // trigger any effects of clearing the field
            if (typeof onChange === 'function') {
                onChange('');
            }
        },
        [formApi, onChange]
    );

    useSearchParam({ location, parameter: 'query', setValue });

    const resetForm = useCallback(() => {
        formApi.reset();
    }, [formApi]);

    // When the search field is opened focus on the input.
    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    return {
        inputRef,
        resetForm,
        value
    };
};
