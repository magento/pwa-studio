import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import gql from 'graphql-tag';
import { Util, useToasts } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import i18n from 'i18next';
import i18next from 'i18next';
const { BrowserPersistence } = Util;

export const useLocalization = (props = {}) => {
    const [, { addToast }] = useToasts();
    const [appState, appApi] = useAppContext();

    const storage = new BrowserPersistence();
    if (storage.getItem('store_view') === undefined) {
        storage.setItem('store_view', process.env.DEFAULT_LOCALE);
    }

    const initialLocale = storage.getItem('store_view');
    const initialStoreView = storage.getItem('store_view');
    
    const GET_AVAILABLE_STORE_VIEWS = gql`
        query {
            availableStoreViews {
                items {
                    code,
                    name,
                    locale
                }
            }
        }
    `;

    const [currentLocale, setCurrentLocale] = useState(initialLocale);
    const [currentStoreView, setCurrentStoreView] = useState(initialStoreView);

    const fetchCartDetails = useAwaitQuery(GET_AVAILABLE_STORE_VIEWS);

    let cachedStoreViews = [];
    if (storage.getItem('available_store_views') !== undefined) {
        cachedStoreViews = storage.getItem('available_store_views');
    }
    const [ availableLangs, setAvailableLangs ] = useState(cachedStoreViews);

    useEffect(() => {
        if (storage.getItem('loading_store_views') === undefined || storage.getItem('loading_store_views') === false) {
            storage.setItem('loading_store_views', true);

            fetchCartDetails().then((result) => {
                storage.setItem('available_store_views', result.data.availableStoreViews.items);
                setAvailableLangs(result.data.availableStoreViews.items.map(item => {
                    return item.locale.toLowerCase();
                }))
            });
        }
    }, []);

    const localizationState = { availableLangs };

    const _t = useCallback((phrase) => {
        return i18n.t(phrase);
    }, []);

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