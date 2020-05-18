import { func } from 'prop-types';
import { useFreePaymentMethod } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/PaymentMethods/useFreePaymentMethod';

import freePaymentMethodOperations from './freePaymentMethod.gql';

const FreePaymentMethod = props => {
    const { setDoneEditing } = props;

    useFreePaymentMethod({
        setDoneEditing,
        ...freePaymentMethodOperations
    });

    return null;
};

export default FreePaymentMethod;

FreePaymentMethod.propTypes = {
    setDoneEditing: func.isRequired
};
