import React from 'react';
import { func, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';

import { useResetForm } from '@magento/peregrine/lib/hooks/useResetForm';

import Icon from '../../Icon';

const UpdateModalCancelIconButton = props => {
    const { className, onClick } = props;

    const { handleClick } = useResetForm({ onClick });

    return (
        <button className={className} onClick={handleClick} type="button">
            <Icon src={CloseIcon} />
        </button>
    );
};

export default UpdateModalCancelIconButton;

UpdateModalCancelIconButton.propTypes = {
    className: string,
    onClick: func.isRequired
};
