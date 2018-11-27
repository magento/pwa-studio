export const getCountryName = ({ directory: { countries } }, countryId) => {
    const country = countries.find(country => country.id === countryId);

    return country ? country.full_name_locale : null;
};
