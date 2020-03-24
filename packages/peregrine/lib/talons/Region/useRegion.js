import { useQuery } from '@apollo/react-hooks';
import { useFieldState } from 'informed';

export const useRegion = props => {
    const {
        queries: { getRegionsQuery }
    } = props;

    const countryState = useFieldState('country');
    const { value: country } = countryState;

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
