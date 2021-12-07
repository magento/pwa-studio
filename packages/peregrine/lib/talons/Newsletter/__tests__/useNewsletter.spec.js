import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useMutation, useQuery } from '@apollo/client';
import { useNewsletter } from '../useNewsletter';

/*
 * Mocks.
 */
jest.mock('@apollo/client', () => {
    const useMutation = jest.fn();
    const useQuery = jest.fn();

    return { useMutation, useQuery };
});

jest.mock('@magento/peregrine/lib/util/shallowMerge', () => {
    return jest.fn(() => ({}));
});

jest.mock('../newsletter.gql', () => ({}));

const mockEmail = { email: 'test@example.com' };

/*
 * Members.
 */
const log = jest.fn();
let talonProps;
const Component = props => {
    talonProps = useNewsletter({ ...props });

    log(talonProps);

    return null;
};

const props = {};

beforeEach(() => {
    talonProps = null;
    useMutation.mockImplementation(() => {
        return [
            null,
            {
                data: null,
                loading: false
            }
        ];
    });
    useQuery.mockReturnValue({
        data: {
            storeConfig: {
                newsletter_enabled: true
            }
        },
        loading: false
    });
});

/*
 * Tests.
 */
describe('#useNewsletter display', () => {
    test('it returns loading state when fetching store config', async () => {
        // Act.
        useQuery.mockReturnValue({
            data: null,
            loading: true
        });

        createTestInstance(<Component {...props} key="a" />);

        // Assert.
        const { isLoading } = talonProps;
        expect(isLoading).toBeTruthy();
    });

    test('it returns enabled flag', async () => {
        // Act.
        useQuery.mockReturnValue({
            data: {
                storeConfig: {
                    newsletter_enabled: false
                }
            },
            loading: false
        });

        createTestInstance(<Component {...props} key="a" />);

        // Assert.
        const { isEnabled } = talonProps;
        expect(isEnabled).toBeFalsy();
    });
});

describe('#useNewsletter subscribe', () => {
    test('it submits the form to the backend', async () => {
        // Act.
        const mockSubscribeNewsletter = jest.fn();
        const mockResponse = { message: 'Success' };
        useMutation.mockImplementation(() => {
            return [
                mockSubscribeNewsletter,
                {
                    data: { subscribeEmailToNewsletter: mockResponse }
                }
            ];
        });

        createTestInstance(<Component {...props} key="a" />);

        talonProps.handleSubmit(mockEmail);

        // Assert.
        expect(mockSubscribeNewsletter).toHaveBeenCalledWith({
            variables: mockEmail
        });
        expect(talonProps.newsLetterResponse).toEqual(mockResponse);
    });
});
