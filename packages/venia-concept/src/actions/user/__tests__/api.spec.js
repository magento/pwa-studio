import { RestApi } from '@magento/peregrine';

import { getCountryName, fetchUserDetails } from '../api';

const { request } = RestApi.Magento2;

const countryId = 'US';
const countryName = 'United States';
const countries = [
    {
        id: 'AD',
        two_letter_abbreviation: 'AD',
        three_letter_abbreviation: 'AND',
        full_name_locale: 'Andorra',
        full_name_english: 'Andorra'
    },
    {
        id: countryId,
        two_letter_abbreviation: 'US',
        three_letter_abbreviation: 'USA',
        full_name_locale: countryName,
        full_name_english: 'United States'
    }
];

const userId = 1;
const userAddresses = [
    {
        id: 1,
        country_id: 'US'
    }
];

afterEach(() => {
    request.mockClear();
});

test('getCountryName searches country name by id', () => {
    expect(getCountryName(countries, countryId)).toBe(countryName);
});

test('fetchUserDetails returns user details', async () => {
    request
        .mockReturnValueOnce(
            Promise.resolve({ id: userId, addresses: userAddresses })
        )
        .mockReturnValueOnce(Promise.resolve(countries));

    const userDetails = await fetchUserDetails();

    expect(userDetails).toEqual({
        id: userId,
        addresses: userAddresses.map(address => ({
            ...address,
            country: countryName
        }))
    });
});
