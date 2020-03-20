import { useMemo, useState, useCallback } from 'react';
import { Util, useToasts } from '@magento/peregrine';
import i18n from 'i18next';
import i18next from 'i18next';
const { BrowserPersistence } = Util;

export const useLocalization = (props = {}) => {
    const [, { addToast }] = useToasts();

    const storage = new BrowserPersistence();
    const initialLocale = storage.getItem('store_view');
    const initialStoreView = storage.getItem('store_view');

    const [currentLocale, setCurrentLocale] = useState(initialLocale);
    const [currentStoreView, setCurrentStoreView] = useState(initialStoreView);

    const localizationState = { currentLocale, currentStoreView };

    const _t = (phrase) => {
        return i18n.t(phrase);
    };

    // Absolunet
    const handleSwitchLang = useCallback((lang) => {
        storage.setItem('store_view', lang);
        setCurrentLocale(lang);
        setCurrentStoreView(lang);
        i18next.changeLanguage(lang);

        addToast({
            type: 'info',
            message: _t('Switching Store View to ' + lang),
            timeout: 3000
        });
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