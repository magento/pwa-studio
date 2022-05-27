import { useEffect } from 'react';
import { useFieldApi } from 'informed';

import useFieldState from '../../hooks/hook-wrappers/useInformedFieldStateWrapper';

export const useCheckbox = props => {
    const { ariaLabel, field, fieldValue, id } = props;

    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);

    useEffect(() => {
        if (fieldValue != null && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [fieldApi, fieldState.value, fieldValue]);

    const labelProps = {
        'aria-label': ariaLabel,
        'data-cy': 'Checkbox-label',
        htmlFor: id
    };

    const controlProps = {
        field,
        id
    };

    return {
        ...props,
        controlProps,
        labelProps
    };
};
