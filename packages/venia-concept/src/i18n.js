import i18n from 'i18next';
import merge from 'lodash/merge';
import resourcesVeniaUI from '@alienfast/i18next-loader!@magento/venia-ui/lib/locales/index.js';
import resourcesLocal from '@alienfast/i18next-loader!./locales/index.js';
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;

/**
 * Initialize the i18n object for our app
 * Also loads our translation files
 */
export const initi18n = () => {
  /**
   * Merge Venia UI and Local Resources together
   * We can add additional resources here (maybe from peregrine for example)
   * Would want to look at exposing this to the extensibility work also
   */
  const resources = merge(resourcesVeniaUI,resourcesLocal);

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