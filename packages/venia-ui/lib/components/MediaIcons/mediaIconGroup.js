import React from 'react';
import Image from '../Image';
import facebookLogo from './icons/facebook.svg';
import instagramLogo from './icons/instagram.svg';
import twitterLogo from './icons/twitter.svg';
import youtubeLogo from './icons/youtube.svg';
import {object, string, number, shape} from 'prop-types';

import {mergeClasses} from '../../classify';
import defaultClasses from './mediaIconGroup.css';


const MediaIconGroup = props => {
    const {links, height, width} = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    return <div className={classes.root}>
        <a className={classes.LogoClass} href={links.facebook}>
            <Image
                alt="Facebook"
                classes={{image: classes.facebookLogoClass}}
                height={height}
                src={facebookLogo}
                title="Facebook"
                width={width}
            />
        </a>
        <a className={classes.LogoClass} href={links.instagram}>
            <Image
                alt="Instagram"
                classes={{image: classes.instagramLogoClass}}
                height={height}
                src={instagramLogo}
                title="Instagram"
                width={width}
            />
        </a>
        <a className={classes.LogoClass} href={links.twitter}>
            <Image
                alt="Twitter"
                classes={{image: classes.twitterLogoClass}}
                height={height}
                src={twitterLogo}
                title="Twitter"
                width={width}
            />
        </a>
        <a className={classes.LogoClass} href={links.youtube}>
            <Image
                alt="Youtube"
                classes={{image: classes.youtubeLogoClass}}
                height={height}
                src={youtubeLogo}
                title="Youtube"
                width={width}
            />
        </a>
    </div>
};

MediaIconGroup.propTypes = {
    classes: shape({
        facebookLogoClass: string,
        instagramLogoClass: string,
        twitterLogoClass: string,
        youtubeLogoClass: string,
        root: string,
        LogoClass: string,
        tileBody: string,
        tileTitle: string
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
