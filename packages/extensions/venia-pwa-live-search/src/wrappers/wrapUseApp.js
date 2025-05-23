//import useCustomUrl from '../hooks/useCustomUrl';
//import useReferrerUrl from '../hooks/useReferrerUrl';
import usePageView from '../hooks/eventing/usePageView';
import useShopperContext from '../hooks/eventing/useShopperContext';
import useStorefrontInstanceContext from '../hooks/eventing/useStorefrontInstanceContext';
import useMagentoExtensionContext from '../hooks/eventing/useMagentoExtensionContext';
//import useCart from '../hooks/useCart';
import mse from '@adobe/magento-storefront-events-sdk';
import msc from '@adobe/magento-storefront-event-collector';

export default function wrapUseApp(origUseApp) {
  if (!window.magentoStorefrontEvents) {
    window.magentoStorefrontEvents = mse;
  }
  msc;

  return function (props) {
    useShopperContext();
    useStorefrontInstanceContext();
    useMagentoExtensionContext();
    //useCart();
    //useCustomUrl();
    //useReferrerUrl();
    usePageView();

    return origUseApp(props);
  };
}
