import {useMutation} from "@apollo/client";
import {useEffect} from "react";
import {GET_BRAINTREE_CLIENT_TOKEN} from '../Queries/createBraintreeClientToken.gql';

/**
 *
 * @returns {*|string}
 */
export const useBraintreeThreeDSecure = () => {
    const [setBraintreeClientToken, {data}] = useMutation(GET_BRAINTREE_CLIENT_TOKEN);
    const clientToken = data ? data.createBraintreeClientToken : '';
    /**
     * set Braintree Client Token
     */
    useEffect(() => {
        if(!clientToken) {
            setBraintreeClientToken();
        }
    }, []);

    return clientToken;
}
