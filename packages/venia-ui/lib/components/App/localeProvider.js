import React, { useEffect, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { fromReactIntl, toReactIntl } from '../../util/formatLocale';
import { gql, useQuery } from '@apollo/client';
import LoadingIndicator from '../LoadingIndicator';

const DEFAULT_LOCALE = 'en-US';

const GET_LOCALE = gql`
    query getLocale {
        storeConfig {
            id
            locale
        }
    }
`;

const LocaleProvider = props => {
    const [messages, setMessages] = useState(null);
    const { data } = useQuery(GET_LOCALE, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const language = useMemo(() => {
        return data && data.storeConfig.locale
            ? toReactIntl(data.storeConfig.locale)
            : DEFAULT_LOCALE;
    }, [data]);

    /**
     * At build time, `__fetchLocaleData__` is injected as a global. Depending on the environment, this global will be
     * either an ES module with a `default` property, or a plain CJS module.
     *
     * Please see {LocalizationPlugin} at @magento/pwa-buildpack/WebpackTools/plugins/LocalizationPlugin.js
     */
    const fetchLocale =
        'default' in __fetchLocaleData__
            ? __fetchLocaleData__.default
            : __fetchLocaleData__;

    useEffect(() => {
        if (language) {
            const locale = fromReactIntl(language);
            fetchLocale(locale)
                .then(data => {
                    setMessages(data.default);
                })
                .catch(error => {
                    console.error(
                        `Unable to load translation file. \n${error}`
                    );
                });
        }
    }, [fetchLocale, language]);

    const onIntlError = error => {
        if (messages) {
            if (error.code === 'MISSING_TRANSLATION') {
                console.warn('Missing translation', error.message);
                return;
            }
            throw error;
        }
    };

    if (!messages) return <LoadingIndicator global={true} />;

    return (
        <IntlProvider
            key={language}
            {...props}
            defaultLocale={DEFAULT_LOCALE}
            locale={language}
            messages={messages}
            onError={onIntlError}
        />
    );
};

export default LocaleProvider;
