import { useCallback, useMemo } from 'react';

import * as RestApi from '../RestApi';
import { useRestResponse } from './useRestResponse';

const { request } = RestApi.Magento2;

/**
 * Exposes an API for sending REST calls and handling their responses.
 *
 * @param {String} endpoint - A Magento 2 REST API endpoint.
 *  Ex: /rest/V1/carts/mine/estimate-shipping-methods
 */
export const useRestApi = endpoint => {
    const [restResponseState, restResponseApi] = useRestResponse();
    const { receiveError, receiveResponse, setLoading } = restResponseApi;

    // Define a callback that sends a request
    // either as an effect or in response to user interaction.
    const sendRequest = useCallback(
        async ({ options }) => {
            // setLoading to true before making the call.
            // There is no need to setLoading to false after because
            // both receiveResponse and receiveError handle that.
            setLoading(true);

            try {
                const response = await request(endpoint, options);
                receiveResponse(response);
            } catch (error) {
                // error is of type M2ApiResponseError here.
                receiveError(error.baseMessage);
            }
        },
        [endpoint, receiveError, receiveResponse, setLoading]
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
