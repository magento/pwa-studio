import { RestApi } from '@magento/peregrine';

const { request } = RestApi.Magento2;

const getCountryName = (countries, countryId) => {
    const country = countries.find(country => country.id === countryId);

    return country ? country.full_name_locale : '';
};

// TODO: right now country name is not a part of the address object.
export const fetchUserDetails = async () => {
    const [userDetails, countries = []] = await Promise.all([
        request('/rest/V1/customers/me'),
        request('/rest/V1/directory/countries')
    ]);

    if (!userDetails) {
        return userDetails;
    }

    const { addresses = [] } = userDetails;
    return {
        ...userDetails,
        addresses: addresses.map(address => ({
            ...address,
            country: getCountryName(countries, address.country_id)
        }))
    };
};
