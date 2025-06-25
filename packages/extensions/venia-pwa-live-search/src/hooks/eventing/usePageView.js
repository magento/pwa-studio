import useLocation from './useLocation';
import { useEffect } from 'react';
import mse from '@adobe/magento-storefront-events-sdk';
import { getPagetype } from '../../utils/eventing/getPageType';

const usePageView = () => {
    const location = useLocation();
    const pageType = getPagetype(location);
    useEffect(() => {
        mse.context.setPage({ pageType });
        mse.publish.pageView();
    }, [location]);
};

export default usePageView;
