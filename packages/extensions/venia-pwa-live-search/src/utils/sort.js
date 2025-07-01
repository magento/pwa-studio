/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

//hooks error - need to check
//import { useTranslation } from '../context/translation';

const defaultSortOptions = () => {
    return [
        { label: 'Most Relevant', value: 'relevance_DESC' },
        { label: 'Price: Low to High', value: 'price_ASC' },
        { label: 'Price: High to Low', value: 'price_DESC' }
    ];
};

const getSortOptionsfromMetadata = (
    sortMetadata,
    displayOutOfStock,
    categoryPath,
    translation
) => {
    const sortOptions = categoryPath
        ? [
              {
                  label: translation?.SortDropdown?.positionLabel || 'Position', // Now uses translation
                  value: 'position_ASC'
              }
          ]
        : [
              {
                  label:
                      translation?.SortDropdown?.relevanceLabel ||
                      'Most Relevant', // Now uses translation
                  value: 'relevance_DESC'
              }
          ];

    const displayInStockOnly = displayOutOfStock != '1'; // '!=' is intentional for conversion

    if (sortMetadata && sortMetadata.length > 0) {
        sortMetadata.forEach(e => {
            if (
                !e.attribute.includes('relevance') &&
                !(e.attribute.includes('inStock') && displayInStockOnly) &&
                !e.attribute.includes('position')
                /* conditions for which we don't display the sorting option:
                1) if the option attribute is relevance
                2) if the option attribute is "inStock" and display out of stock products is set to no
                3) if the option attribute is "position" and there is not a categoryPath (we're not in category browse mode) -> the conditional part is handled in setting sortOptions
                */
            ) {
                if (e.numeric && e.attribute.includes('price')) {
                    sortOptions.push({
                        label: `${e.label}: Low to High`,
                        value: `${e.attribute}_ASC`
                    });
                    sortOptions.push({
                        label: `${e.label}: High to Low`,
                        value: `${e.attribute}_DESC`
                    });
                } else {
                    sortOptions.push({
                        label: `${e.label}`,
                        value: `${e.attribute}_DESC`
                    });
                }
            }
        });
    }
    return sortOptions;
};

const generateGQLSortInput = sortOption => {
    // results sorted by relevance or position by default
    if (!sortOption) {
        return undefined;
    }

    // sort options are in format attribute_direction
    const index = sortOption.lastIndexOf('_');
    return [
        {
            attribute: sortOption.substring(0, index),
            direction:
                sortOption.substring(index + 1) === 'ASC' ? 'ASC' : 'DESC'
        }
    ];
};

export { defaultSortOptions, generateGQLSortInput, getSortOptionsfromMetadata };
