// import { useQuery, useLazyQuery } from '@apollo/client';
// import { useCallback, useState, useEffect, useMemo } from 'react';
// import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
// import {
//     GET_FULL_CATALOG,
//     GET_TOTAL_PAGE

// } from './getCatalog.gql';

// export const useDownloadCsv = () => {
//     const [loading, setLoading] = useState(false);

//     const fetchCatalogPage = useAwaitQuery(GET_FULL_CATALOG);
//     const fetchTotalPage = useAwaitQuery(GET_TOTAL_PAGE);

//     const handleFullCatalog = useCallback(async () => {
//         try {
//             const tempTotalPageResponse = await fetchTotalPage();
//             const totalPages =
//                 tempTotalPageResponse.data.products.page_info.total_pages;
//             let tempFullCatalog = [];

//             if (tempTotalPageResponse) {
//                 for (let i = 1; i <= totalPages; i++) {
//                     const temporalCatalogResponse = await fetchCatalogPage({
//                         variables: { currentPage: i }
//                     });
//                     console.log('currentPage', i);
//                     tempFullCatalog.push(
//                         temporalCatalogResponse.data.products.items
//                     );
//                 }
//             }
//             return tempFullCatalog;
//         } catch (e) {
//             console.log('error', e);
//         }
//     }, [fetchCatalogPage]);

//     return { handleFullCatalog };
// };
