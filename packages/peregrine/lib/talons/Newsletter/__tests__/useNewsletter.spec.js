import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useMutation } from '@apollo/client';
import { useNewsletter } from '../useNewsletter';

/*
 * Mocks.
 */
jest.mock('@apollo/client', () => {
    const useMutation = jest.fn();

    return { useMutation };
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
});

/*
 * Tests.
 */
test('it submits the form to the backend', async () => {
    // Act.
    const mockSubscribeNewsletter = jest.fn();
    const mockResponse = { message: 'Success' };
    useMutation.mockImplementation(() => {
        return [
            mockSubscribeNewsletter,
            {
                error: null,
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

test('it handles submission errors', async () => {
    // Act.
    const mockSubscribeNewsletter = jest.fn(() => {
        throw new Error('some error');
    });
    useMutation.mockImplementation(() => {
        return [
            mockSubscribeNewsletter,
            {
                error: 'some error',
                data: null
            }
        ];
    });

    createTestInstance(<Component {...props} key="a" />);

    talonProps.handleSubmit(mockEmail);

    // Assert.
    expect(mockSubscribeNewsletter).toHaveBeenCalled();
    expect(talonProps.errors).toBeInstanceOf(Map);
    expect(talonProps.errors.get('subscribeMutation')).toEqual('some error');
});
