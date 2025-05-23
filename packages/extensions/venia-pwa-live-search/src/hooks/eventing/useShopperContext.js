import { useEffect } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mse from '@adobe/magento-storefront-events-sdk';
import { getDecodedCookie } from '../../utils/eventing/getCookie';

const useShopperContext = () => {
  const [{ isSignedIn }] = useUserContext();

  useEffect(() => {
    if (isSignedIn) {
      try {
        const customerGroupCode = getDecodedCookie(
          'dataservices_customer_group=',
        );
        mse.context.setContext('customerGroup', customerGroupCode);
      } catch (error) {
        console.error(
          'Cannot access customer group cookie. It seems the data-services module is not able to populate cookies properly.',
          error,
        );
      }
      mse.context.setShopper({
        shopperId: 'logged-in',
      });
    } else {
      mse.context.setShopper({
        shopperId: 'guest',
      });
    }
  }, [isSignedIn]);
};

export default useShopperContext;
