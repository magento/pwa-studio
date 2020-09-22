import React, { useEffect, useState } from 'react';
import { fromReactIntl, toReactIntl } from '../../util/formatLocale';
import { IntlProvider } from 'react-intl';

const language = toReactIntl(STORE_VIEW_LOCALE);
const locale = fromReactIntl(language);

const LocaleProvider = props => {
    const [messages, setMessages] = useState(null);

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
        fetchLocale(locale)
            .then(data => {
                setMessages(data.default);
            })
            .catch(error => {
                console.error(`Unable to load translation file. \n${error}`);
            });
    }, [fetchLocale, setMessages]);

    const onIntlError = error => {
        if (messages) {
            if (error.code === 'MISSING_TRANSLATION') {
                console.warn('Missing translation', error.message);
                return;
            }
            throw error;
        }
    };

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
