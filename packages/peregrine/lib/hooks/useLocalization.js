import { useMemo, useState, useCallback } from 'react';
import { Util, useToasts } from '@magento/peregrine';
import i18n from 'i18next';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const useLocalization = () => {
    const [, { addToast }] = useToasts();

    const availableStoreViews = AVAILABLE_STORE_VIEWS;
    const availableLangs = availableStoreViews.map(item => {
        return item.locale.toLowerCase();
    });

    const [currentLocale, setCurrentLocale] = useState(
        storage.getItem('locale')
    );
    const [currentStoreView, setCurrentStoreView] = useState(
        storage.getItem('store_view')
    );
    const localizationState = {
        currentLocale,
        currentStoreView,
        availableLangs,
        availableStoreViews
    };

    const _t = useCallback(phrase => {
        return i18n.t(phrase);
    }, []);

    /**
     * Handling switch store via redirect / refresh for now
     * @TODO Find a more elegant solution to refresh all graphql queries with new header store code
     */
    const changeLanguage = useCallback((item) => {
        storage.setItem('store_view', item.code);
        storage.setItem('locale', item.locale);

        setCurrentLocale(item.locale);
        setCurrentStoreView(item.code);
        i18n.changeLanguage(item.locale.toLowerCase());

        addToast({
            type: 'info',
            message: _t(
                `Switching Store View to ${item.name}, the page will reload briefly`
            ),
            timeout: 3000
        });

        window.location.replace(
            `/${storage.getItem('locale').toLowerCase()}`
        );
    }, [addToast, _t])

    /**
     * Handles switching store by store code (in switcher component)
     */
    const handleSwitchStore = useCallback(
        code => {
            const newStoreView = availableStoreViews.reduce(function(acc, item) {
                return acc !== false ? acc: (item.code == code ? item : false);
            }, false);

            changeLanguage(newStoreView);
        },
        [availableStoreViews, changeLanguage]
    );

    /**
     * Handles switching store by locale (eg: in route)
     */
    const handleSwitchStoreByLocale = useCallback(
        locale => {
            const newStoreView = availableStoreViews.reduce(function(acc, item) {
                return acc !== false ? acc: (item.locale == locale ? item : false);
            }, false);

            changeLanguage(newStoreView);
        },
        [availableStoreViews, changeLanguage]
    );

    const api = useMemo(
        () => ({
            handleSwitchStore,
            handleSwitchStoreByLocale,
            _t
        }),
        [handleSwitchStore, handleSwitchStoreByLocale, _t]
    );

    return [localizationState, api];
};
