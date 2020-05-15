import { bool, func } from 'prop-types';
import { useFreePaymentMethod } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/PaymentMethods/useFreePaymentMethod';

import freePaymentMethodOperations from './freePaymentMethod.gql';

const FreePaymentMethod = props => {
    const { onSubmit, setDoneEditing, shouldSubmit } = props;

    useFreePaymentMethod({
        onSubmit,
        setDoneEditing,
        shouldSubmit,
        ...freePaymentMethodOperations
    });

    return null;
};

export default FreePaymentMethod;

FreePaymentMethod.propTypes = {
    onSubmit: func.isRequired,
    setDoneEditing: func.isRequired,
    shouldSubmit: bool
};
