import React from 'react';
import Image from '../Image';
import facebookLogo from './icons/facebook.svg';
import instagramLogo from './icons/instagram.svg';
import twitterLogo from './icons/twitter.svg';
import youtubeLogo from './icons/youtube.svg';
import { object, string, number, shape } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './mediaIconGroup.css';

/**
 * A component that renders social media icons in the footer.
 *
 * @typedef MediaIconGroup
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays social media icons in the footer.
 */
const MediaIconGroup = props => {
    const { links, height, width } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <a className={classes.LogoClass} href={links.facebook}>
                <Image
                    alt="Facebook"
                    classes={{ image: classes.facebookLogoClass }}
                    height={height}
                    src={facebookLogo}
                    title="Facebook"
                    width={width}
                />
            </a>
            <a className={classes.LogoClass} href={links.instagram}>
                <Image
                    alt="Instagram"
                    classes={{ image: classes.instagramLogoClass }}
                    height={height}
                    src={instagramLogo}
                    title="Instagram"
                    width={width}
                />
            </a>
            <a className={classes.LogoClass} href={links.twitter}>
                <Image
                    alt="Twitter"
                    classes={{ image: classes.twitterLogoClass }}
                    height={height}
                    src={twitterLogo}
                    title="Twitter"
                    width={width}
                />
            </a>
            <a className={classes.LogoClass} href={links.youtube}>
                <Image
                    alt="Youtube"
                    classes={{ image: classes.youtubeLogoClass }}
                    height={height}
                    src={youtubeLogo}
                    title="Youtube"
                    width={width}
                />
            </a>
        </div>
    );
};

/**
 * Props for {@link MediaIconGroup}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * MediaIconGroup component.
 * @property {string} classes.facebookLogoClass class for facebook icon
 * @property {string} classes.instagramLogoClass class for instagram icon
 * @property {string} classes.twitterLogoClass class for twitter icon
 * @property {string} classes.youtubeLogoClass class for youtube icon
 * @property {object} links for filling the href attribute for an icon
 * @property {number} height the height of the icons.
 * @property {number} width the height of the icons.
 */
MediaIconGroup.propTypes = {
    classes: shape({
        facebookLogoClass: string,
        instagramLogoClass: string,
        twitterLogoClass: string,
        youtubeLogoClass: string,
        root: string,
        LogoClass: string
    }),
    links: object,
    height: number,
    width: number
};

MediaIconGroup.defaultProps = {
    height: 30,
    width: 30
};

export default MediaIconGroup;
