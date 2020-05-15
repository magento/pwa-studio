import { bool, func } from 'prop-types';
import { useCheckmoMethod } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/PaymentMethods/useCheckmoMethod';

import freePaymentMethodOperations from './checkmoMethod.gql';

const CheckmoMethod = props => {
    const { onSubmit, setDoneEditing, shouldSubmit } = props;

    useCheckmoMethod({
        onSubmit,
        setDoneEditing,
        shouldSubmit,
        ...freePaymentMethodOperations
    });

    return null;
};

export default CheckmoMethod;

CheckmoMethod.propTypes = {
    onSubmit: func.isRequired,
    setDoneEditing: func.isRequired,
    shouldSubmit: bool
};
