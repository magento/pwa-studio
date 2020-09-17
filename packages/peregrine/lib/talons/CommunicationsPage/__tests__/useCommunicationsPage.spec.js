import React from 'react';
import { useQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useCommunicationsPage } from '../useCommunicationsPage';

const mockSetNewsletterSubscription = jest.fn();

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: true
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockImplementation(mutation => {
        if (mutation === 'setNewsletterSubscriptionMutation')
            return [mockSetNewsletterSubscription, { loading: false }];

        return;
    }),
    useQuery: jest.fn().mockReturnValue({
        data: {
            customer: {
                id: null,
                is_subscribed: false
            }
        },
        error: null,
        loading: false
    })
}));

const Component = props => {
    const talonProps = useCommunicationsPage(props);
    return <i talonProps={talonProps} />;
};

const afterSubmit = jest.fn();

const mockProps = {
    afterSubmit,
    mutations: {
        setNewsletterSubscriptionMutation: 'setNewsletterSubscriptionMutation'
    },
    queries: {
        getCustomerSubscriptionQuery: 'getCustomerSubscriptionQuery'
    }
};

test('return correct shape while data is loading', () => {
    useQuery.mockReturnValueOnce({
        loading: true
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape for initial customer data', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape for new value and fire create mutation', async () => {
    useQuery.mockReturnValueOnce({
        data: {
            customer: {
                id: 5,
                is_subscribed: false
            }
        },
        error: null,
        loading: true
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();

    const { handleSubmit } = talonProps;

    await handleSubmit({
        isSubscribed: true
    });

    expect(mockSetNewsletterSubscription).toHaveBeenCalled();
    expect(mockSetNewsletterSubscription.mock.calls[0][0]).toMatchSnapshot();
    expect(afterSubmit).toHaveBeenCalled();
});

test('does not call afterSubmit if mutation fails', async () => {
    mockSetNewsletterSubscription.mockRejectedValue('Apollo Error');

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({
        isSubscribed: true
    });

    expect(mockSetNewsletterSubscription).toHaveBeenCalled();
    expect(afterSubmit).not.toHaveBeenCalled();
});
