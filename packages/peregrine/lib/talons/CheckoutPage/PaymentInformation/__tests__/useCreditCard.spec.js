import { renderHook } from '@testing-library/react-hooks';
import { useMutation, useApolloClient } from '@apollo/client';
import { useCreditCard } from '../useCreditCard';

/**
 * Apollo mocks
 */
jest.mock('@apollo/client', () => ({
    useMutation: jest.fn(),
    useApolloClient: jest.fn(),
    useQuery: jest.fn(() => ({ data: {} })),
    gql: jest.fn()
}));

/**
 * Cart context mock
 */
jest.mock('@magento/peregrine/lib/context/cart', () => ({
    useCartContext: jest.fn(() => [{ cartId: 'test-cart-id' }, jest.fn()])
}));

describe('useCreditCard talon', () => {
    const mockMutationFn = jest.fn();
    const mockWriteQuery = jest.fn();

    const defaultProps = {
        onSuccess: jest.fn(),
        shouldSubmit: false,
        resetShouldSubmit: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useApolloClient.mockReturnValue({
            writeQuery: mockWriteQuery
        });

        useMutation.mockReturnValue([
            mockMutationFn,
            {
                called: false,
                loading: false,
                error: undefined
            }
        ]);
    });

    test('should initialize without crashing', () => {
        const { result } = renderHook(() => useCreditCard(defaultProps));

        expect(result.current).toBeDefined();
    });

    test('should expose loading state', () => {
        useMutation.mockReturnValueOnce([
            mockMutationFn,
            {
                called: false,
                loading: true,
                error: undefined
            }
        ]);

        const { result } = renderHook(() => useCreditCard(defaultProps));

        expect(result.current.isLoading).toBeDefined();
    });

    test('should call onSuccess when mutation completes successfully', () => {
        const onSuccess = jest.fn();

        useMutation.mockReturnValueOnce([
            mockMutationFn,
            {
                called: true,
                loading: false,
                error: undefined
            }
        ]);

        renderHook(() =>
            useCreditCard({
                ...defaultProps,
                onSuccess
            })
        );

        expect(onSuccess).toHaveBeenCalled();
    });

    test('should not crash when mutation errors', () => {
        useMutation.mockReturnValueOnce([
            mockMutationFn,
            {
                called: true,
                loading: false,
                error: new Error('Mutation failed')
            }
        ]);

        const { result } = renderHook(() => useCreditCard(defaultProps));

        expect(result.current).toBeDefined();
    });
});
