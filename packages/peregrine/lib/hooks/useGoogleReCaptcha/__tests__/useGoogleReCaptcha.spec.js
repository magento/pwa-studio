import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';

import typePolicies from '@magento/peregrine/lib/Apollo/policies';

import DEFAULT_OPERATIONS from '../googleReCaptchaConfig.gql';
import { useGoogleReCaptcha } from '../useGoogleReCaptcha';

jest.mock('@magento/peregrine/lib/hooks/useScript', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return 'ready';
        })
    };
});

const getReCaptchaV3ConfigMock1 = {
    request: {
        query: DEFAULT_OPERATIONS.getReCaptchaV3ConfigQuery
    },
    result: {
        data: {
            recaptchaV3Config: {
                __typename: 'RecaptchaV3Config',
                website_key: 'key',
                minimum_score: '0.5',
                badge_position: 'bottomRight',
                language_code: 'en',
                failure_message: '',
                forms: ['CURRENT_FORM']
            }
        }
    }
};

const initialProps = {
    currentForm: 'CURRENT_FORM'
};

const cache = new InMemoryCache({
    typePolicies
});

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [getReCaptchaV3ConfigMock1]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} cache={cache} addTypename={true}>
            {children}
        </MockedProvider>
    );

    return renderHook(useGoogleReCaptcha, { wrapper, ...renderHookOptions });
};

describe('#useGoogleReCaptcha', () => {
    beforeEach(() => {
        globalThis.grecaptcha = {
            execute: (recaptchaKey, { action }) => `${recaptchaKey}_${action}`
        };
    });

    it('returns correct shape while and after loading', async () => {
        const { result, waitForNextUpdate } = renderHookWithProviders();

        // Check data while loading
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "generateReCaptchaData": [Function],
              "isGenerating": false,
              "isLoading": true,
            }
        `);

        // Wait for query to finish loading
        await waitForNextUpdate();

        // Check data after load
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "generateReCaptchaData": [Function],
              "isGenerating": false,
              "isLoading": false,
            }
        `);
    });

    it('returns correct shape when script is not available', async () => {
        const { result, waitForNextUpdate } = renderHookWithProviders();

        globalThis.grecaptcha = undefined;

        // Wait for query to finish loading
        await waitForNextUpdate();

        // Check data after load
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "generateReCaptchaData": [Function],
              "isGenerating": false,
              "isLoading": false,
            }
        `);
    });

    it('returns token when user ask for generation', async () => {
        const { result, waitForNextUpdate } = renderHookWithProviders();

        // Wait for query to finish loading
        await waitForNextUpdate();

        // Ask generation of token
        await act(async () => {
            const tokenData = await result.current.generateReCaptchaData();

            expect(tokenData).toMatchInlineSnapshot(`
                Object {
                  "context": Object {
                    "headers": Object {
                      "X-ReCaptcha": "key_CURRENT_FORM",
                    },
                  },
                }
            `);
        });
    });

    it('returns empty object when user ask for generation and script is not enabled', async () => {
        const { result, waitForNextUpdate } = renderHookWithProviders({
            renderHookOptions: {
                initialProps: {
                    currentForm: ''
                }
            }
        });

        globalThis.grecaptcha = undefined;

        // Wait for query to finish loading
        await waitForNextUpdate();

        // Ask generation of token
        await act(async () => {
            const tokenData = await result.current.generateReCaptchaData();

            expect(tokenData).toMatchInlineSnapshot(`Object {}`);
        });
    });
});
