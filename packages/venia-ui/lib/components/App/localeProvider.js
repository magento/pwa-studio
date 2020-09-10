import React, { useEffect, useState } from 'react';
import { fromReactIntl, toReactIntl } from '../../util/formatLocale';
import { IntlProvider } from 'react-intl';

const language = toReactIntl(STORE_VIEW_LOCALE);
const locale = fromReactIntl(language);

const LocaleProvider = props => {
    const [messages, setMessages] = useState(null);

    useEffect(() => {
        /**
         * This is automatically created during the build by LocalizationPlugin
         * https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
         */
        import(
            `i18n/${locale}.json`
            )
            .then(data => {
                setMessages(data.default);
            })
            .catch(error => {
                console.error(`Unable to load translation file. \n${error}`);
            });
    }, [setMessages]);

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
