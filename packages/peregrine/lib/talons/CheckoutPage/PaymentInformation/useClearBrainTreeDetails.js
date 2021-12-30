const useClearBrainTreeDetails = () => {

     const operations = mergeOperations(
         DEFAULT_OPERATIONS,
         props.operations
     );
    const [{ cartId }] = useCartContext();
    const client = useApolloClient();
    const clearPaymentDetails = useCallback(() => {
        client.writeQuery({
            query: getPaymentNonceQuery,
            data: {
                cart: {
                    __typename: 'Cart',
                    id: cartId,
                    paymentNonce: null
                }
            }
        });
    }, [cartId, client, getPaymentNonceQuery]);

    return { clearPaymentDetails };
};

export default useClearBrainTreeDetails;
