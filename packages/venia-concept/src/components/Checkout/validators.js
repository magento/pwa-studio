import store from 'src/store';

export const validateRegionCode = regionCode => {
    const { directory } = store.getState();
    const { countries } = directory;
    const country = countries.find(({ id }) => id === 'US');

    if (!country) {
        return 'Country "US" is not an available country.';
    }
    const { available_regions: regions } = country;

    if (!(Array.isArray(regions) && regions.length)) {
        return 'Country "US" does not contain any available regions.';
    }

    const region = regions.find(({ code }) => code === regionCode);
    if (!region) {
        return `State "${regionCode}" is not an valid state abbreviation.`;
    }

    return null;
};
