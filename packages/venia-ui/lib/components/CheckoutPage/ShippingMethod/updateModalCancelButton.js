import React from 'react';
import { func, string } from 'prop-types';

import { useResetForm } from '@magento/peregrine/lib/hooks/useResetForm';

import Button from '../../Button';

const UpdateModalCancelButton = props => {
    const { className, onClick } = props;

    const { handleClick } = useResetForm({ onClick });

    return (
        <Button className={className} onClick={handleClick}>
            {'Cancel'}
        </Button>
    );
};

export default UpdateModalCancelButton;

UpdateModalCancelButton.propTypes = {
    className: string,
    onClick: func.isRequired
};
