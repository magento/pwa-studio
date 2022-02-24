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

const getReCaptchaV3ConfigMockDefault = {
    request: {
        query: DEFAULT_OPERATIONS.getReCaptchaV3ConfigQuery
    },
    result: {
        data: {
            recaptchaV3Config: {
                __typename: 'RecaptchaV3Config',
                website_key: 'key',
                badge_position: 'bottomright',
                language_code: 'en',
                forms: ['CURRENT_FORM']
            }
        }
    }
};

const getReCaptchaV3ConfigMockInline = {
    request: {
        query: DEFAULT_OPERATIONS.getReCaptchaV3ConfigQuery
    },
    result: {
        data: {
            recaptchaV3Config: {
                __typename: 'RecaptchaV3Config',
                website_key: 'key',
                badge_position: 'inline',
                language_code: 'en',
                forms: ['CURRENT_FORM']
            }
        }
    }
};

const mockWidgetId = '10';

const initialProps = {
    currentForm: 'CURRENT_FORM',
    formAction: 'testFormAction'
};

const cache = new InMemoryCache({
    typePolicies
});

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [getReCaptchaV3ConfigMockDefault]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} cache={cache} addTypename={true}>
            {children}
        </MockedProvider>
    );

    return renderHook(useGoogleReCaptcha, { wrapper, ...renderHookOptions });
};

const grecaptchaMock = {
    execute: (recaptchaKey, { action }) => `${recaptchaKey}_${action}`,
    render: () => mockWidgetId
};

describe('#useGoogleReCaptcha', () => {
    afterEach(() => {
        delete globalThis.grecaptcha;
        globalThis['recaptchaCallbacks'] = {};
    });

    it('returns correct shape while and after loading', async () => {
        const { result, waitFor } = renderHookWithProviders();

        // Check data while loading
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "generateReCaptchaData": [Function],
              "recaptchaLoading": true,
              "recaptchaWidgetProps": Object {
                "containerElement": [Function],
                "shouldRender": false,
              },
            }
        `);

        // Call script onload method
        await act(async () => {
            await globalThis.onloadRecaptchaCallback();
            globalThis.grecaptcha = grecaptchaMock;
        });

        // Wait for query to finish loading
        await waitFor(() => result.current.recaptchaLoading === false);

        // Check data while loading
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "generateReCaptchaData": [Function],
              "recaptchaLoading": false,
              "recaptchaWidgetProps": Object {
                "containerElement": [Function],
                "shouldRender": false,
              },
            }
        `);
    });

    it('updates the badge styles when script onload method is called', async () => {
        const floatingBadge = document.createElement('div');
        floatingBadge.className = 'grecaptcha-badge';
        document.body.append(floatingBadge);

        const { result, waitFor } = renderHookWithProviders();

        // Call script onload method
        await act(async () => {
            await globalThis.onloadRecaptchaCallback();
            globalThis.grecaptcha = grecaptchaMock;
        });

        // Wait for query to finish loading
        await waitFor(() => result.current.recaptchaLoading === false);

        // Check floating badge style
        expect(floatingBadge.style.zIndex).toEqual('999');
    });

    it('returns widget id when position inline and container component is defined', async () => {
        const floatingBadge = document.createElement('div');
        floatingBadge.className = 'grecaptcha-badge';
        document.body.append(floatingBadge);

        const inlineContainer = document.createElement('div');

        const { result, waitFor } = renderHookWithProviders({
            mocks: [getReCaptchaV3ConfigMockInline]
        });

        // Create container element
        await act(async () => {
            const containerElement = await result.current.recaptchaWidgetProps
                .containerElement;

            containerElement(inlineContainer);
        });

        // Call script onload method
        await act(async () => {
            await globalThis.onloadRecaptchaCallback();
            globalThis.grecaptcha = grecaptchaMock;
        });

        // Wait for query to finish loading
        await waitFor(() => result.current.recaptchaLoading === false);

        // Check floating badge style is not updated
        expect(floatingBadge.style.zIndex).not.toEqual('999');

        // Check Widget ID has been set on the container
        expect(inlineContainer.dataset).toEqual(
            expect.objectContaining({
                widgetId: mockWidgetId
            })
        );
    });

    it('returns empty token object when user ask for generation and api is not defined', async () => {
        const { result, waitFor } = renderHookWithProviders();

        // Wait for query to finish loading
        await waitFor(() => result.current.recaptchaLoading === false);

        // Ask generation of token
        await act(async () => {
            const tokenData = await result.current.generateReCaptchaData();

            expect(tokenData).toEqual({});
        });
    });

    it('returns empty token object when user ask for generation and it returns an error', async () => {
        globalThis.grecaptcha = {};

        const { result, waitFor } = renderHookWithProviders();

        // Call script onload method
        await act(async () => {
            await globalThis.onloadRecaptchaCallback();
        });

        // Wait for query to finish loading
        await waitFor(() => result.current.recaptchaLoading === false);

        // Ask generation of token
        await act(async () => {
            const tokenData = await result.current.generateReCaptchaData();

            expect(tokenData).toEqual({});
        });
    });

    it('returns token when user ask for generation', async () => {
        const { result, waitFor } = renderHookWithProviders();

        // Call script onload method
        await act(async () => {
            await globalThis.onloadRecaptchaCallback();
            globalThis.grecaptcha = grecaptchaMock;
        });

        // Wait for query to finish loading
        await waitFor(() => result.current.recaptchaLoading === false);

        // Ask generation of token
        await act(async () => {
            const tokenData = await result.current.generateReCaptchaData();

            expect(tokenData).toMatchInlineSnapshot(`
                Object {
                  "context": Object {
                    "headers": Object {
                      "X-ReCaptcha": "key_testFormAction",
                    },
                  },
                }
            `);
        });
    });

    it('returns token when user ask for generation with already defined inline badge', async () => {
        const inlineContainer = document.createElement('div');
        inlineContainer.dataset.widgetId = mockWidgetId;

        const { result, waitFor } = renderHookWithProviders({
            mocks: [getReCaptchaV3ConfigMockInline]
        });

        // Create container element
        await act(async () => {
            const containerElement = await result.current.recaptchaWidgetProps
                .containerElement;

            containerElement(inlineContainer);
        });

        // Call script onload method
        await act(async () => {
            await globalThis.onloadRecaptchaCallback();
            globalThis.grecaptcha = grecaptchaMock;
        });

        // Wait for query to finish loading
        await waitFor(() => result.current.recaptchaLoading === false);

        // Ask generation of token
        await act(async () => {
            const tokenData = await result.current.generateReCaptchaData();

            expect(tokenData).toMatchInlineSnapshot(`
                Object {
                  "context": Object {
                    "headers": Object {
                      "X-ReCaptcha": "10_testFormAction",
                    },
                  },
                }
            `);
        });
    });
});
