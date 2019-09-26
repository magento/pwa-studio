import { useCallback } from 'react';
import { useFieldState, useFormApi } from 'informed';

import { useSearchParam } from '../../hooks/useSearchParam';

/**
 * Returns props necessary to render a SearchField component.
 *
 * @param {Object} props
 * @param {Object} props.location
 * @param {Function} props.onChange
 */
export const useSearchField = props => {
    const { location, onChange } = props;
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

    return {
        resetForm,
        value
    };
};
