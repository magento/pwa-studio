import { useQuery } from '@apollo/react-hooks';

import { useRegion } from '../useRegion';

jest.mock('informed', () => {
    const useFieldState = jest.fn().mockReturnValue({
        value: 'US'
    });

    return { useFieldState };
});

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest.fn().mockReturnValue({
        data: {
            country: {
                available_regions: [
                    { code: 'NY', id: 1, name: 'New York' },
                    { code: 'TX', id: 2, name: 'Texas' }
                ]
            }
        },
        error: false,
        loading: false
    })
}));

const props = {
    queries: {}
};

test('returns formatted regions', () => {
    const talonProps = useRegion(props);
    expect(talonProps).toMatchSnapshot();
});

test('returns empty array if no available regions', () => {
    useQuery.mockReturnValueOnce({
        data: {
            country: {
                available_regions: null
            }
        },
        error: false,
        loading: false
    });

    const talonProps = useRegion(props);
    expect(talonProps).toMatchSnapshot();
});
