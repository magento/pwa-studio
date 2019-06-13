import { useCallback, useMemo } from 'react';

import * as RestApi from '../RestApi';
import { useRestResponse } from './useRestResponse';

const { request } = RestApi.Magento2;

export const useRestApi = endpoint => {
    const [restResponseState, restResponseApi] = useRestResponse();
    const { receiveError, receiveResponse, setLoading } = restResponseApi;

    // Define a callback that performs a query
    // either as an effect or in response to user interaction.
    const sendRequest = useCallback(
        async ({ options }) => {
            setLoading(true);

            try {
                const response = await request(endpoint, options);
                receiveResponse(response);
            } catch (error) {
                // error is of type M2ApiResponseError here.
                receiveError(error.baseMessage);
            }
        },
        [receiveError, receiveResponse, setLoading]
    );

    const api = useMemo(
        () => ({
            ...restResponseApi,
            sendRequest
        }),
        [restResponseApi, sendRequest]
    );

    return [restResponseState, api];
};
