import i18n from 'i18next';
import merge from 'lodash/merge';
import resourcesVeniaUI from '@alienfast/i18next-loader!@magento/venia-ui/lib/locales/index.js';
import resources from '@alienfast/i18next-loader!./locales/index.js';
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;

export const initi18n = () => {
  console.log({ resources, resourcesVeniaUI}, merge(resourcesVeniaUI,resources));

  const storage = new BrowserPersistence();
  const storeView = storage.getItem('store_view');

  i18n.init({ 
    lng: storeView,
    debug: true,
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: false,
    resources
  });
}