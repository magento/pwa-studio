import React from 'react';
import { useFormApi } from 'informed';
import { func } from 'prop-types';
import { X as ClearIcon } from 'react-feather';

import Icon from '../Icon';
import Trigger from '../Trigger';

const clearIcon = <Icon src={ClearIcon} size={24} />;

const ResetButton = props => {
    const { onReset } = props;
    const formApi = useFormApi();

    const handleReset = () => {
        formApi.reset();

        if (onReset) {
            onReset();
        }
    };

    return <Trigger action={handleReset}>{clearIcon}</Trigger>;
};

export default ResetButton;

ResetButton.propTypes = {
    onReset: func
};
