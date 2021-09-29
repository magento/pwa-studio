import React from 'react';
import defaultClasses from './video.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { arrayOf, shape, string, bool } from 'prop-types';

/**
 * Page Builder Video component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Video
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Video using an iframe.
 */
const Video = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        url = '',
        autoplay,
        muted,
        maxWidth,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const mainStyles = {
        textAlign,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft
    };
    const innerStyles = {
        maxWidth
    };
    const wrapperStyles = {
        border,
        borderColor,
        borderWidth,
        borderRadius,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };
    const youtubeRegExp = new RegExp(
        '^(?:https?://|//)?(?:www\\.|m\\.)?' +
            '(?:youtu\\.be/|youtube\\.com/(?:embed/|v/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?![\\w-])'
    );
    const vimeoRegExp = new RegExp(
        'https?://(?:www\\.|player\\.)?vimeo.com/(?:channels/' +
            '(?:\\w+/)?|groups/([^/]*)/videos/|album/(\\d+)/video/|video/|)(\\d+)(?:$|/|\\?)'
    );

    let Video = '';

    if (
        url &&
        url.length &&
        (youtubeRegExp.test(url) || vimeoRegExp.test(url))
    ) {
        Video = (
            <div className={classes.container}>
                <iframe
                    className={classes.video}
                    title={url}
                    frameBorder="0"
                    allowFullScreen="1"
                    loading="lazy"
                    src={url}
                />
            </div>
        );
    } else if (url && url.length) {
        /* eslint-disable jsx-a11y/media-has-caption */
        Video = (
            <div className={classes.container}>
                <video
                    className={classes.video}
                    src={url}
                    autoPlay={autoplay}
                    muted={muted}
                    frameBorder="0"
                    controls={true}
                />
            </div>
        );
        /* eslint-enable jsx-a11y/media-has-caption */
    }

    return (
        <div
            style={mainStyles}
            className={[classes.root, ...cssClasses].join(' ')}
        >
            <div style={innerStyles} className={classes.inner}>
                <div style={wrapperStyles} className={classes.wrapper}>
                    {Video}
                </div>
            </div>
        </div>
    );
};

/**
 * Props for {@link Video}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Video
 * @property {String} classes.root CSS classes for the root container element
 * @property {String} classes.inner CSS classes for the inner container element
 * @property {String} classes.wrapper CSS classes for the wrapper container element
 * @property {String} classes.container CSS classes for the container element
 * @property {String} classes.video CSS classes for the video element
 * @property {String} url URL to render the video from an external provider (YouTube, Vimeo etc)
 * @property {Boolean} autoplay Video autoplay
 * @property {Boolean} muted Video muted
 * @property {String} maxWidth Maximum width of the video
 * @property {String} textAlign Alignment of the video within the parent container
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Video.propTypes = {
    classes: shape({
        root: string,
        inner: string,
        wrapper: string,
        container: string,
        video: string
    }),
    url: string,
    autoplay: bool,
    muted: bool,
    maxWidth: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string)
};

export default Video;
