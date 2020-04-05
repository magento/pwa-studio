import { useMemo, useState, useCallback, useEffect } from 'react';
import { Util, useToasts } from '@magento/peregrine';
import i18n from 'i18next';
import i18next from 'i18next';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const useLocalization = (props = {}) => {
    const [, { addToast }] = useToasts();

    const availableStoreViews = AVAILABLE_STORE_VIEWS;
    const availableLangs = availableStoreViews.map(item => {
        return item.locale.toLowerCase();
    });

    const [currentLocale, setCurrentLocale] = useState(storage.getItem('locale'));
    const [currentStoreView, setCurrentStoreView] = useState(storage.getItem('store_view'));
    const localizationState = { currentLocale, currentStoreView, availableLangs, availableStoreViews };

    const _t = useCallback((phrase) => {
        return i18n.t(phrase);
    }, []);

    const handleSwitchStore = useCallback((code) => {
        /**
         * Handling switch store via redirect / refresh for now
         * @TODO Find a more elegant solution to refresh all graphql queries with new header store code
        */
        let storeName = null;
        availableStoreViews.forEach((element) => {
            if (element.code === code) {
                storage.setItem('store_view', code);
                storage.setItem('locale', element.locale);
                storeName = element.name;

                setCurrentLocale(element.locale);
                setCurrentStoreView(code);

                i18next.changeLanguage(element.locale.toLowerCase());
            }
        });

        addToast({
            type: 'info',
            message: _t(`Switching Store View to ${storeName}, the page will reload briefly`),
            timeout: 3000
        });

        window.location.replace(`/${storage.getItem('locale').toLowerCase()}`);
    }, [addToast]);

    const handleSwitchStoreByLocale = useCallback((locale) => {
        /**
         * Handling switch store by locale via redirect / refresh for now
         * @TODO Find a more elegant solution to refresh all graphql queries with new header store code
        */
        let storeName = null;
        availableStoreViews.forEach((element) => {
            if (element.locale.toLowerCase() === locale.toLowerCase()) {
                storage.setItem('store_view', element.code);
                storage.setItem('locale', element.locale);
                storeName = element.name;

                setCurrentLocale(element.locale);
                setCurrentStoreView(element.code);

                i18next.changeLanguage(element.locale.toLowerCase());
            }
        });

        addToast({
            type: 'info',
            message: _t(`Switching Store View to ${storeName}, the page will reload briefly`),
            timeout: 3000
        });

        window.location.replace(`/${storage.getItem('locale').toLowerCase()}`);
    }, [addToast]);

    const api = useMemo(
        () => ({
            handleSwitchStore,
            handleSwitchStoreByLocale,
            _t
        }),
        [handleSwitchStore, handleSwitchStoreByLocale, _t]
    );

    return [localizationState, api];
}