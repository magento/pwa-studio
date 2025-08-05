/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useSearch } from '../context';

const useRangeFacet = ({ attribute, buckets }) => {
    const processedBuckets = {};

    buckets.forEach(bucket => {
        processedBuckets[bucket.title] = {
            from: bucket.from,
            to: bucket.to
        };
    });

    const searchCtx = useSearch();

    const filter = searchCtx?.filters?.find(e => e.attribute === attribute);

    const isSelected = title => {
        const selected = filter
            ? processedBuckets[title].from === filter.range?.from &&
              processedBuckets[title].to === filter.range?.to
            : false;
        return selected;
    };

    const onChange = value => {
        const selectedRange = processedBuckets[value];

        if (!filter) {
            const newFilter = {
                attribute,
                range: {
                    from: selectedRange.from,
                    to: selectedRange.to
                }
            };
            searchCtx.createFilter(newFilter);
            return;
        }

        const newFilter = {
            ...filter,
            range: {
                from: selectedRange.from,
                to: selectedRange.to
            }
        };
        searchCtx.updateFilter(newFilter);
    };

    return { isSelected, onChange };
};

export default useRangeFacet;
