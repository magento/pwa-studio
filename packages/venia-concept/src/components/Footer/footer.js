import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import Newsletter from '@magento/venia-ui/lib/components/Newsletter';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Footer/footer.module.css';
import { DEFAULT_LINKS } from '@magento/venia-ui/lib/components/Footer/sampleData';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import copyrightLogo from './assets/copyright.svg';
import facebookLogo from './assets/facebook.svg';
import instagramLogo from './assets/instagram.svg';
import youtubeLogo from './assets/youtube.svg';
import b2bLogo from '../Logo/B2Blogo.svg';

const Footer = props => {
    const { links } = props;
    const classes = useStyle(defaultClasses, props.classes);

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
            <main className={classes.branding}>
                <section className={classes.copyrightContainer}>
                    <div className={classes.logos}>
                        <img src={copyrightLogo} alt="copyrightLogo" />
                    </div>
                    <div>
                        <p>2022 B2B Store</p>
                    </div>
                </section>

                <section className={classes.socialMediaB2bLogoContainer}>
                    <ul className={classes.socialMediaContainer}>
                        <li className={classes.logos}>
                            <img src={facebookLogo} alt="facebookLogo" />
                        </li>
                        <li className={classes.logos}>
                            <img src={instagramLogo} alt="instagramLogo" />
                        </li>
                        <li className={classes.logos}>
                            <img src={youtubeLogo} alt="youtubeLogo" />
                        </li>
                    </ul>

                    <div className={classes.b2bLogoContainer}>
                        <Link to={resourceUrl('/')}>
                            <img src={b2bLogo} alt="b2bLogo" />
                        </Link>
                    </div>
                </section>
            </main>
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
