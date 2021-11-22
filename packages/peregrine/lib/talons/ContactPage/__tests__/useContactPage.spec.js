import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useMutation, useQuery } from '@apollo/client';
import useContactPage from '../useContactPage';

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

jest.mock('../contactUs.gql', () => ({}));

const mockContactInfo = {
    name: 'Test Name',
    email: 'test@example.com',
    telephone: '555-555-5555',
    comment: 'Mock contact message'
};

/*
 * Members.
 */
const log = jest.fn();
let talonProps;
const Component = props => {
    talonProps = useContactPage({ ...props });

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
                loading: false,
                error: null
            }
        ];
    });
    useQuery.mockReturnValue({
        data: {
            storeConfig: {
                contact_enabled: true
            }
        },
        loading: false
    });
});

/*
 * Tests.
 */
describe('#useContactPage display', () => {
    test('it returns loading state when fetching store config', async () => {
        // Act.
        useQuery.mockReturnValue({
            data: null,
            loading: true
        });

        await createTestInstance(<Component {...props} key="a" />);

        // Assert.
        const { isLoading } = talonProps;
        expect(isLoading).toBeTruthy();
    });

    test('it returns enabled flag', async () => {
        // Act.
        useQuery.mockReturnValue({
            data: {
                storeConfig: {
                    contact_enabled: false
                }
            },
            loading: false
        });

        await createTestInstance(<Component {...props} key="a" />);

        // Assert.
        const { isEnabled } = talonProps;
        expect(isEnabled).toBeFalsy();
    });
});

describe('#useContactPage submit', () => {
    test('it submits the form to the backend', async () => {
        // Act.
        const mockSend = jest.fn();
        const mockResponse = { message: 'Success' };
        useMutation.mockImplementation(() => {
            return [
                mockSend,
                {
                    error: null,
                    data: { contactUs: mockResponse }
                }
            ];
        });

        await createTestInstance(<Component {...props} key="a" />);

        talonProps.handleSubmit(mockContactInfo);

        // Assert.
        expect(mockSend).toHaveBeenCalledWith({
            variables: mockContactInfo
        });
        expect(talonProps.response).toEqual(mockResponse);
    });

    test('it handles submission errors', async () => {
        // Act.
        const mockSend = jest.fn(() => {
            throw new Error('some error');
        });
        useMutation.mockImplementation(() => {
            return [
                mockSend,
                {
                    error: 'some error',
                    data: null
                }
            ];
        });

        createTestInstance(<Component {...props} key="a" />);

        talonProps.handleSubmit(mockContactInfo);

        // Assert.
        expect(mockSend).toHaveBeenCalled();
        expect(talonProps.errors).toBeInstanceOf(Map);
        expect(talonProps.errors.get('contactMutation')).toEqual('some error');
    });
});
