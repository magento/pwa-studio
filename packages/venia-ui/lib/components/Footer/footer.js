import React, { Fragment } from 'react';
import { Facebook, Instagram, Twitter } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';

import Logo from '../Logo';
import Newsletter from '../Newsletter';
import { useStyle } from '../../classify';
import defaultClasses from './footer.module.css';
import { DEFAULT_LINKS, LOREM_IPSUM } from './sampleData';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

const Footer = props => {
    const { links } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFooter();

    const { copyrightText } = talonProps;
    const { formatMessage } = useIntl();
    const title = formatMessage({ id: 'logo.title', defaultMessage: 'Venia' });

    const linkGroups = Array.from(links, ([groupKey, linkProps]) => {
        const linkElements = Array.from(linkProps, ([text, pathInfo]) => {
            let path = pathInfo;
            let Component = Fragment;
            if (pathInfo && typeof pathInfo === 'object') {
                path = pathInfo.path;
                Component = pathInfo.Component;
            }

            const itemKey = `text: ${text} path:${path}`;
            const child = path ? (
                <Link data-cy="Footer-link" className={classes.link} to={path}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </Link>
            ) : (
                <span data-cy="Footer-label" className={classes.label}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </span>
            );

            return (
                <Component key={itemKey}>
                    <li className={classes.linkItem}>{child}</li>
                </Component>
            );
        });

        return (
            <ul key={groupKey} className={classes.linkGroup}>
                {linkElements}
            </ul>
        );
    });

    return (
        <footer data-cy="Footer-root" className={classes.root}>
            <div className={classes.links}>
                {linkGroups}
                <div className={classes.callout}>
                    <span
                        data-cy="Footer-calloutHeading"
                        className={classes.calloutHeading}
                    >
                        <FormattedMessage
                            id={'footer.followText'}
                            defaultMessage={'Follow Us!'}
                        />
                    </span>
                    <p
                        data-cy="Footer-calloutText"
                        className={classes.calloutBody}
                    >
                        <FormattedMessage
                            id={'footer.calloutText'}
                            defaultMessage={LOREM_IPSUM}
                        />
                    </p>
                    <ul className={classes.socialLinks}>
                        <li>
                            <Instagram size={20} />
                        </li>
                        <li>
                            <Facebook size={20} />
                        </li>
                        <li>
                            <Twitter size={20} />
                        </li>
                    </ul>
                </div>
                <Newsletter />
            </div>
            <div className={classes.branding}>
                <ul className={classes.legal}>
                    <li data-cy="Footer-terms" className={classes.terms}>
                        <FormattedMessage
                            id={'footer.termsText'}
                            defaultMessage={'Terms of Use'}
                        />
                    </li>
                    <li data-cy="Footer-privacy" className={classes.privacy}>
                        <FormattedMessage
                            id={'footer.privacyText'}
                            defaultMessage={'Privacy Policy'}
                        />
                    </li>
                </ul>
                <p className={classes.copyright}>{copyrightText || null}</p>
                <Link
                    to={resourceUrl('/')}
                    aria-label={title}
                    className={classes.logoContainer}
                >
                    <Logo classes={{ logo: classes.logo }} />
                </Link>
            </div>
        </footer>
    );
};

export default Footer;

Footer.defaultProps = {
    links: DEFAULT_LINKS
};

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
