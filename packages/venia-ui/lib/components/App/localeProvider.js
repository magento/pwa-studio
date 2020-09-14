import React, { useEffect, useState } from 'react';
import { fromReactIntl, toReactIntl } from '../../util/formatLocale';
import { IntlProvider } from 'react-intl';
import GET_CONFIG_DATA from '../../queries/getStoreConfigData.graphql';
import { useQuery } from '@apollo/client';
import { fullPageLoadingIndicator } from '../LoadingIndicator';

const LocaleProvider = props => {
    const [messages, setMessages] = useState(null);
    const { data, loading } = useQuery(GET_CONFIG_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const language =
        data && data.storeConfig.locale
            ? toReactIntl(data.storeConfig.locale)
            : null;

    useEffect(() => {
        if (language) {
            const locale = fromReactIntl(language);
            import(`../../i18n/${locale}.json`)
                .then(data => {
                    setMessages(data.default);
                })
                .catch(error => {
                    console.error(
                        `Unable to load translation file. \n${error}`
                    );
                });
        }
    }, [setMessages, language]);

    const onIntlError = error => {
        if (messages) {
            if (error.code === 'MISSING_TRANSLATION') {
                console.warn('Missing translation', error.message);
                return;
            }
            throw error;
        }
    };

    if (loading) return fullPageLoadingIndicator;

    return (
        <IntlProvider
            key={language}
            {...props}
            defaultLocale="en-US"
            locale={language}
            messages={messages}
            onError={onIntlError}
        />
    );
};

export default LocaleProvider;
