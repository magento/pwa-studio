import React from 'react';
import { useFormApi } from 'informed';
import { func } from 'prop-types';
import { X as ClearIcon } from 'react-feather';

import Icon from '../Icon';
import Trigger from '../Trigger';
import { useIntl } from 'react-intl';

const clearIcon = <Icon src={ClearIcon} size={24} />;

const ResetButton = props => {
    const { onReset } = props;
    const formApi = useFormApi();

    const { formatMessage } = useIntl();

    const handleReset = () => {
        formApi.reset();

        if (onReset) {
            onReset();
        }
    };

    const ariaLabel = formatMessage({
        id: 'orderRow.clearSearch',
        defaultMessage: 'Clear order search field'
    });

    return (
        <Trigger ariaLabel={ariaLabel} action={handleReset}>
            {clearIcon}
        </Trigger>
    );
};

export default ResetButton;

ResetButton.propTypes = {
    onReset: func
};
