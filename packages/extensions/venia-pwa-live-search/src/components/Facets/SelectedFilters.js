/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from 'react';
import { useSearch, useProducts, useTranslation } from '../../context';
import Pill from '../Pill';
import { formatBinaryLabel, formatRangeLabel } from './format';

const SelectedFilters = () => {
    const searchCtx = useSearch();
    const productsCtx = useProducts();
    const translation = useTranslation();

    return (
        <div className="w-full h-full">
            {searchCtx.filters?.length > 0 && (
                <div className="ds-plp-facets__pills pb-6 sm:pb-6 flex flex-wrap mt-8 justify-start">
                    {searchCtx.filters.map(filter => (
                        <div key={filter.attribute}>
                            {filter.in?.map(option => (
                                <Pill
                                    key={formatBinaryLabel(
                                        filter,
                                        option,
                                        searchCtx.categoryNames,
                                        productsCtx.categoryPath
                                    )}
                                    label={formatBinaryLabel(
                                        filter,
                                        option,
                                        searchCtx.categoryNames,
                                        productsCtx.categoryPath
                                    )}
                                    type="transparent"
                                    onClick={() =>
                                        searchCtx.updateFilterOptions(
                                            filter,
                                            option
                                        )
                                    }
                                />
                            ))}
                            {filter.range && (
                                <Pill
                                    label={formatRangeLabel(
                                        filter,
                                        productsCtx.currencyRate,
                                        productsCtx.currencySymbol
                                    )}
                                    type="transparent"
                                    onClick={() => {
                                        searchCtx.removeFilter(
                                            filter.attribute
                                        );
                                    }}
                                />
                            )}
                        </div>
                    ))}
                    <div className="py-1">
                        <button
                            className="ds-plp-facets__header__clear-all border-none bg-transparent hover:border-none	hover:bg-transparent
              focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none text-sm px-4"
                            onClick={() => searchCtx.clearFilters()}
                        >
                            {translation.Filter.clearAll}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectedFilters;
