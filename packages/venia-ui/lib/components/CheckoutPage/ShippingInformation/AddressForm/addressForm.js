import React from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import CustomerForm from './customerForm';
import GuestForm from './guestForm';

/**
 * Simple component that acts like an AddressForm factory, giving the client
 * the correct form to render based on the current signed in state.
 */
const AddressForm = props => {
    const [{ isSignedIn }] = useUserContext();
    const AddressForm = isSignedIn ? CustomerForm : GuestForm;

    return <AddressForm {...props} />;
};

export default AddressForm;
