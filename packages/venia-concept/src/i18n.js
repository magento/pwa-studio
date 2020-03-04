import i18n from 'i18next';
import resources from '@alienfast/i18next-loader!./locales/index.js';
import { Util } from '@magento/peregrine';

const { BrowserPersistence } = Util;
//import veniaResources from '@alienfast/i18next-loader!@magento/venia-ui/lib/locales/index.js';
//import { useApp } from '@magento/peregrine/lib/talons/App/useApp';

export const initi18n = () => {
  const storage = new BrowserPersistence();
  const storeView = storage.getItem('store_view');

  i18n.init({ 
    lng: storeView,
    debug: true,
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: false,
    resources,
    query: {
        overrides: [
            '../../../node_modules/@magento/venia-ui/lib/locales'
        ]
    }
  });
}