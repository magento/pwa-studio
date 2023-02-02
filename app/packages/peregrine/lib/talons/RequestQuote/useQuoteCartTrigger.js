import { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const DENIED_MINI_CART_ROUTES = ['/checkout'];
export const AFTER_UPDATE_MY_REQUEST_QUOTE = 'after_update_my_request_quote';

import { MP_QUOTE, DELETE_ITEM_FROM_MP_QUOTE, GET_CUSTOMER } from '../RequestQuote/requestQuote.gql';

export const useQuoteCartTrigger = props => {
    const { getConfigData, getQuoteId, setQuoteId } = props;

    const configData = getConfigData();

    const [myQuote, setMyQuote] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [{ isSignedIn: isUserSignedIn }] = useUserContext();
    const { data: custoemrData } = useQuery(GET_CUSTOMER, {
        fetchPolicy: 'network-only',
        skip: !isUserSignedIn
    });

    useMemo(() => {
        if (custoemrData && custoemrData.customer) {
            const {
                customer: { mp_quote_id }
            } = custoemrData;
            setQuoteId(mp_quote_id);
        }
    }, [custoemrData, setQuoteId]);

    const {
        elementRef: quoteMiniCartRef,
        expanded: quoteMiniCartIsOpen,
        setExpanded: setQuoteMiniCartIsOpen,
        triggerRef: quoteMiniCartTriggerRef
    } = useDropdown();
    const history = useHistory();

    const hideQuoteCartTrigger = DENIED_MINI_CART_ROUTES.includes(history.location.pathname);

    // Get Mp Quote
    const { data } = useQuery(MP_QUOTE, {
        fetchPolicy: 'network-only',
        variables: {
            quote_id: getQuoteId()
        }
    });

    // Delete Mp Quote Item
    const [deleteItemFromMpQuote] = useMutation(DELETE_ITEM_FROM_MP_QUOTE);

    useEffect(() => {
        if (data != undefined) {
            const {
                mpQuote: { quote }
            } = data;
            setMyQuote(quote);
        }
    }, [data]);

    useState(() => {
        window.addEventListener(
            AFTER_UPDATE_MY_REQUEST_QUOTE,
            async function(event) {
                setIsLoading(true);
                await setMyQuote(event.detail);
                setIsLoading(false);
            },
            false
        );
    });

    const handleTriggerClick = useCallback(() => {
        // Open the mini cart.
        setQuoteMiniCartIsOpen(isOpen => !isOpen);
    }, [setQuoteMiniCartIsOpen]);

    const handleLinkClick = useCallback(() => {
        // Send the user to the cart page.
        history.push('/mprequestforquote/quoteCart');
    }, [history]);

    const handleDeleteItem = useCallback(
        async itemId => {
            await setIsLoading(true);
            const {
                data: {
                    deleteItemFromMpQuote: { quote }
                }
            } = await deleteItemFromMpQuote({
                variables: {
                    itemId: parseInt(itemId)
                }
            });
            await setMyQuote(quote);
            await setIsLoading(false);
        },
        [deleteItemFromMpQuote]
    );

    return {
        isLoading,
        myQuote,
        ...configData,
        handleLinkClick,
        handleTriggerClick,
        quoteMiniCartIsOpen,
        quoteMiniCartRef,
        hideQuoteCartTrigger,
        setQuoteMiniCartIsOpen,
        quoteMiniCartTriggerRef,
        handleDeleteItem
    };
};
