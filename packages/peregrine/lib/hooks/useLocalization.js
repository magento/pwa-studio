import { useMemo, useState, useCallback } from 'react';
import { Util, useToasts } from '@magento/peregrine';
import i18n from 'i18next';
import i18next from 'i18next';
const { BrowserPersistence } = Util;

export const useLocalization = (props = {}) => {
    const [, { addToast }] = useToasts();

    const storage = new BrowserPersistence();
    if (storage.getItem('store_view') === undefined) {
        storage.setItem('store_view', process.env.DEFAULT_LOCALE);
    }

    const availableLangs = ['en_ca', 'fr_ca'];
    const initialLocale = storage.getItem('store_view');
    const initialStoreView = storage.getItem('store_view');

    const [currentLocale, setCurrentLocale] = useState(initialLocale);
    const [currentStoreView, setCurrentStoreView] = useState(initialStoreView);
    const localizationState = { currentLocale, currentStoreView, availableLangs };

    const _t = (phrase) => {
        return i18n.t(phrase);
    };

    const handleSwitchLang = useCallback((lang) => {
        /**
         * Handling switch store via redirect / refresh for now
         * @TODO Find a more elegant solution to refresh all graphql queries with new header store code
        */
        storage.setItem('store_view', lang);
        setCurrentLocale(lang);
        setCurrentStoreView(lang);
        i18next.changeLanguage(lang);

        addToast({
            type: 'info',
            message: _t(`Switching Store View to ${lang}, the page will reload briefly`),
            timeout: 3000
        });

        window.location.replace(`/${lang}`);
    }, [addToast]);

    const api = useMemo(
        () => ({
            handleSwitchLang,
            _t
        }),
        [handleSwitchLang, _t]
    );

    return [localizationState, api];
}