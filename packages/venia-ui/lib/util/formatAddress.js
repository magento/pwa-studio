/**
 * Formats an address with the country and region code.
 */
export default function(address = {}, countries = []) {
    const country = countries.find(({ id }) => id === 'US');
    const { region_code } = address;
    const { available_regions: regions } = country;
    const region = regions.find(({ code }) => code === region_code);

    return {
        country_id: 'US',
        region_id: region.id,
        region_code: region.code,
        region: region.name,
        ...address
    };
}
