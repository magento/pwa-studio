import React from 'react';
import { useFieldState, useFormApi } from 'informed';
import { X as ClearIcon } from 'react-feather';

import Icon from '../Icon';
import Trigger from '../Trigger';

const clearIcon = <Icon src={ClearIcon} size={24} />;

const ResetButton = props => {
    const { onReset } = props;
    const searchText = useFieldState('search');
    const formApi = useFormApi();

    const handleReset = () => {
        formApi.reset();
        onReset();
    };

    return searchText ? (
        <Trigger action={handleReset}>{clearIcon}</Trigger>
    ) : null;
};

export default ResetButton;
