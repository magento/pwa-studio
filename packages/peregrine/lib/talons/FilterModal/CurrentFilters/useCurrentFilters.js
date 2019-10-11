import { useCallback } from 'react';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';

export const useCurrentFilters = props => {
    // TODO: Replace with useRouter.
    const { history, location } = props;

    const [{ chosenFilterOptions }, { removeFilter }] = useCatalogContext();

    const handleRemoveOption = useCallback(
        event => {
            const { title, value, dataset } =
                event.currentTarget || event.srcElement;
            const { group } = dataset;
            removeFilter({ title, value, group }, history, location);
        },
        [history, location, removeFilter]
    );

    return {
        chosenFilterOptions,
        handleRemoveOption
    };
};
