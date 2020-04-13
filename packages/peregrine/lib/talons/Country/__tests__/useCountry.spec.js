import { useQuery } from '@apollo/react-hooks';

import { useCountry } from '../useCountry';

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest.fn().mockReturnValue({
        data: null,
        error: null,
        loading: true
    })
}));

const props = {
    queries: {}
};

test('returns loading placeholder option', () => {
    const talonProps = useCountry(props);
    expect(talonProps).toMatchSnapshot();
});

test('returns sorted data', () => {
    useQuery.mockReturnValueOnce({
        data: {
            countries: [
                {
                    two_letter_abbreviation: 'US',
                    full_name_english: 'United States'
                },
                {
                    two_letter_abbreviation: 'NL',
                    full_name_english: 'Netherlands'
                },
                {
                    two_letter_abbreviation: 'FR',
                    full_name_english: 'France'
                }
            ]
        },
        error: false,
        loading: false
    });

    const talonProps = useCountry(props);
    expect(talonProps).toMatchSnapshot();
});
