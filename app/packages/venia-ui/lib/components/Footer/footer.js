import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Twitter, Linkedin, Youtube } from 'react-feather';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import Newsletter from '../Newsletter';
import { useStyle } from '../../classify';
import defaultClasses from './footer.module.css';
import { DEFAULT_LINKS } from './sampleData';
import Logo from '../Logo';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import copyrightLogo from '@magento/venia-ui/lib/assets/copyright.svg';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useStoreConfigData } from '@magento/peregrine/lib/talons/Footer/useStoreConfigData';

const storage = new BrowserPersistence();

const Footer = props => {
    const { links } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const companyTitle = ' 2022 B2B Store';
    const { storeConfigData } = useStoreConfigData();

    if (storeConfigData) {
        storage.setItem('is_required_login', storeConfigData.storeConfig.is_required_login);
    }

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
                    <FormattedMessage id={`footer.${text}`} defaultMessage={text} />
                </Link>
            ) : (
                <span data-cy="Footer-label" className={classes.label}>
                    <FormattedMessage id={`footer.${text}`} defaultMessage={text} />
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
                <Newsletter />
                <div className={classes.nullDiv} />
                {linkGroups}
            </div>
            <div className={classes.branding}>
                <div className={classes.copyrightContainer}>
                    <div className={classes.logos}>
                        <img src={copyrightLogo} alt="copyrightLogo" />
                    </div>
                    <div>
                        <p>{companyTitle}</p>
                    </div>
                </div>

                <div className={classes.socialMediaB2bLogoContainer}>
                    <ul className={classes.socialMediaContainer}>
                        <li className={classes.logos}>
                            <a target="_blank" href="https://twitter.com/orienteed">
                                <Twitter size={20} />
                            </a>
                        </li>
                        <li className={classes.logos}>
                            <a target="_blank" href="https://www.linkedin.com/company/orienteed/">
                                <Linkedin size={20} />
                            </a>
                        </li>
                        <li className={classes.logos}>
                            <a target="_blank" href="https://www.youtube.com/@orienteed">
                                <Youtube size={20} />
                            </a>
                        </li>
                    </ul>

                    <div className={classes.b2bLogoContainer}>
                        <Link to={resourceUrl('/')}>
                            <Logo classes={{ logo: classes.logo }} />
                        </Link>
                    </div>
                </div>
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
