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
   let storeView = storage.getItem('store_view');
    if (storeView === undefined) {
      storage.setItem('store_view', DEFAULT_STORE_VIEW.code);
      storage.setItem('locale', DEFAULT_STORE_VIEW.locale);
    }

  i18n.init({ 
    lng: storage.getItem('locale').toLowerCase(),
    debug: false,
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: false,
    resources
  });
}