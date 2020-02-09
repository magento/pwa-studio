import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';

import { mergeClasses } from '../../classify';
import defaultClasses from './footer.css';
import GET_STORE_CONFIG_DATA from '../../queries/getStoreConfigData.graphql';
import MediaIconGroup from '../MediaIcons/mediaIconGroup';
import { getMediaConfig } from '../../util/getMediaConfig';

const getSocialMediaFooter = (mediaConfig, classes) => {
    if (mediaConfig.enabled) {
        return (
            <div className={classes.tile}>
                <h2 className={classes.tileTitle}>
                    <span>Social Media</span>
                </h2>
                <p className={classes.tileBody}>
                    <span>Follow us on our Social Media platforms.</span>
                </p>
                <MediaIconGroup links={mediaConfig.links} />
            </div>
        );
    }
    return null;
};

const Footer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const mediaConfig = getMediaConfig();

    const talonProps = useFooter({
        query: GET_STORE_CONFIG_DATA
    });
    const { copyrightText } = talonProps;

    let copyright = null;
    if (copyrightText) {
        copyright = <span>{copyrightText}</span>;
    }
    const mediaFooter = useMemo(
        () => getSocialMediaFooter(mediaConfig, classes),
        [mediaConfig, classes]
    );

    return (
        <footer className={classes.root}>
            <div className={classes.tile}>
                <h2 className={classes.tileTitle}>
                    <span>Your Account</span>
                </h2>
                <p className={classes.tileBody}>
                    <span>
                        Sign up and get access to our wonderful rewards program.
                    </span>
                </p>
            </div>
            <div className={classes.tile}>
                <h2 className={classes.tileTitle}>
                    <span>inquiries@example.com</span>
                </h2>
                <p className={classes.tileBody}>
                    <span>
                        Need to email us? Use the address above and we&rsquo;ll
                        respond as soon as possible.
                    </span>
                </p>
            </div>
            <div className={classes.tile}>
                <h2 className={classes.tileTitle}>
                    <span>Live Chat</span>
                </h2>
                <p className={classes.tileBody}>
                    <span>Mon – Fri: 5 a.m. – 10 p.m. PST</span>
                    <br />
                    <span>Sat – Sun: 6 a.m. – 9 p.m. PST</span>
                </p>
            </div>
            <div className={classes.tile}>
                <h2 className={classes.tileTitle}>
                    <span>Help Center</span>
                </h2>
                <p className={classes.tileBody}>
                    <span>Get answers from our community online.</span>
                </p>
            </div>
            {mediaFooter}
            <small className={classes.copyright}>{copyright}</small>
        </footer>
    );
};

Footer.propTypes = {
    classes: shape({
        copyright: string,
        root: string,
        tile: string,
        tileBody: string,
        tileTitle: string
    })
};

export default Footer;
