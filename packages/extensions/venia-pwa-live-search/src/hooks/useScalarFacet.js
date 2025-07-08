/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useSearch } from '../context';

const useScalarFacet = facet => {
    const searchCtx = useSearch();

    const filter = searchCtx?.filters?.find(
        e => e.attribute === facet.attribute
    );

    const isSelected = attribute => {
        return filter ? filter.in?.includes(attribute) : false;
    };

    const onChange = (value, selected) => {
        if (!filter) {
            const newFilter = {
                attribute: facet.attribute,
                in: [value]
            };

            searchCtx.createFilter(newFilter);
            return;
        }

        const newFilter = { ...filter };
        const currentFilterIn = filter.in || [];

        newFilter.in = selected
            ? [...currentFilterIn, value]
            : filter.in?.filter(e => e !== value);

        const filterUnselected = filter.in?.filter(
            x => !newFilter.in?.includes(x)
        );

        if (newFilter.in?.length) {
            if (filterUnselected?.length) {
                searchCtx.removeFilter(facet.attribute, filterUnselected[0]);
            }
            searchCtx.updateFilter(newFilter);
            return;
        }

        if (!newFilter.in?.length) {
            searchCtx.removeFilter(facet.attribute);
        }
    };

    return { isSelected, onChange };
};

export default useScalarFacet;
