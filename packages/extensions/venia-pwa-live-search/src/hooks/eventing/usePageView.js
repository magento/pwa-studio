import useLocation from './useLocation';
import { useEffect, useRef } from 'react';
import mse from '@adobe/magento-storefront-events-sdk';
import usePageTypeFromUrl from '../../utils/eventing/usePageTypeFromUrl';

// const usePageView = () => {
//     const location = useLocation();
//     const pageType = getPagetype(location);
//     useEffect(() => {
//         mse.context.setPage({ pageType });
//         mse.publish.pageView();
//     }, [location]);
// };

const usePageView = () => {
    const location = useLocation();
    const pathname = location?.pathname;

    const pageType = usePageTypeFromUrl(pathname);

    const lastPathnameRef = useRef(null);

    useEffect(() => {
        if (!pathname || !pageType) return;

        // Publish only if pathname actually changed
        if (lastPathnameRef.current === pathname) return;

        lastPathnameRef.current = pathname;

        mse.context.setPage({ pageType });
        mse.publish.pageView();
    }, [pathname, pageType]);
};

export default usePageView;
