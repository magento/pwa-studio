const useProductSort = ({ sortingMethods }) => {
    // price needs to be bidirectional
    const priceSortingPropsDescending = {
        id: 'sortItem.priceDesc',
        text: 'Price: High to Low',
        attribute: 'price',
        sortDirection: 'DESC'
    };
    const priceSortingPropsAscending = {
        id: 'sortItem.priceAsc',
        text: 'Price: Low to High',
        attribute: 'price',
        sortDirection: 'ASC'
    };
    const positionSortProps = {
        id: 'sortItem.position',
        text: 'Position',
        attribute: 'position',
        sortDirection: 'ASC'
    };
    const relevanceSortProps = {
        id: 'sortItem.relevance',
        text: 'Best Match',
        attribute: 'relevance',
        sortDirection: 'DESC'
    };
    const defaultSortingOptions = [
        priceSortingPropsAscending,
        priceSortingPropsDescending,
        positionSortProps,
        relevanceSortProps
    ];

    const sortMethodsFromQuery = sortingMethods
        ? sortingMethods
              .map(method => {
                  let sortingProps;

                  if (method.value !== 'price' && method.value !== 'position') {
                      sortingProps = {
                          ...sortingProps,
                          id: `sortItem.${method.value}`,
                          text: `${method.label}`,
                          attribute: method.value,
                          sortDirection: 'ASC'
                      };
                  }

                  return sortingProps;
              })
              .filter(method => !!method)
        : null;
    console.log(sortMethodsFromQuery);
    // ensures sorting method always exists
    const orderedAvailableSortMethods = sortMethodsFromQuery
        ? [sortMethodsFromQuery, defaultSortingOptions].flat().sort((a, b) => {
              if (a.text < b.text) {
                  return -1;
              }
              if (a.text > b.text) {
                  return 1;
              }
              return 0;
          })
        : defaultSortingOptions;

    return { orderedAvailableSortMethods };
};

export default useProductSort;
