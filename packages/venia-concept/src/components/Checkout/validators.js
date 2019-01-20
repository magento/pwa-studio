import store from 'src/store';

export const validators = new Map()
    .set('email', value => {
        const trimmed = (value || '').trim();

        if (!trimmed) return 'An email address is required.';
        if (!trimmed.includes('@')) return 'A valid email address is required.';

        return null;
    })
    .set('firstName', value => {
        return !(value || '').trim() ? 'A first name is required.' : null;
    })
    .set('lastName', value => {
        return !(value || '').trim() ? 'A last name is required.' : null;
    })
    .set('street', value => {
        return !(value || '').trim() ? 'A street is required.' : null;
    })
    .set('city', value => {
        return !(value || '').trim() ? 'A city is required.' : null;
    })
    .set('postcode', value => {
        return !(value || '').trim() ? 'A ZIP is required.' : null;
    })
    .set('telephone', value => {
        return !(value || '').trim() ? 'A phone is required.' : null;
    })
    .set('regionCode', value => {
        if (!(value || '').trim()) return 'A state is required.';

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

        const region = regions.find(({ code }) => code === value);
        if (!region) {
            return `State "${value}" is not an valid state abbreviation.`;
        }

        return null;
    });
