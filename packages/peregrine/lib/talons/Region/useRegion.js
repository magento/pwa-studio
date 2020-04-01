import { useQuery } from '@apollo/react-hooks';
import { useFieldState } from 'informed';

export const useRegion = props => {
    const {
        countryCodeField = 'country',
        queries: { getRegionsQuery }
    } = props;

    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;

    const { data, error, loading } = useQuery(getRegionsQuery, {
        variables: { countryCode: country }
    });

    let formattedRegionsData = [];
    if (!loading && !error) {
        const { country } = data;
        const { available_regions: availableRegions } = country;
        if (availableRegions) {
            formattedRegionsData = availableRegions.map(region => ({
                key: region.id,
                label: region.name,
                value: region.code
            }));
            formattedRegionsData.unshift({
                disabled: true,
                hidden: true,
                label: '',
                value: ''
            });
        }
    }

    return {
        regions: formattedRegionsData
    };
};
