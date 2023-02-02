import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './CookiesConsent.module.css';

const CookiesConsent = () => {
    const classes = useStyle(defaultClasses);
    return (
        <div className={classes.CookieWrapper}>
            <CookieConsent
                location="bottom"
                buttonText={<FormattedMessage id={'CookiesConsent.accept'} defaultMessage={'Accept'} />}
                cookieName="myAwesomeCookieName2"
                style={{ background: '#2B373B' }}
                buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
                expires={150}
            >
                <FormattedMessage
                    id={'CookiesConsent.cookiesmsg'}
                    defaultMessage={'This website uses cookies to enhance the user experience.'}
                />
                &nbsp;
                <span style={{ fontSize: '10px' }}>
                    <FormattedMessage id={'CookiesConsent.privacy'} defaultMessage={'Privacy'} />
                </span>
            </CookieConsent>
        </div>
    );
};

export default CookiesConsent;
