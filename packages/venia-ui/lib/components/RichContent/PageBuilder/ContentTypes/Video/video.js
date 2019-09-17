import React from 'react';
import defaultClasses from './video.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, shape, string } from 'prop-types';

const Video = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        url,
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
        // The below is required for a quirk in some browsers that won't display borders on videos
        backgroundColor: borderColor,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const Video =
        url && url.length ? (
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
        ) : (
            ''
        );

    return (
        <div
            style={mainStyles}
            className={[classes.root, ...cssClasses].join(' ')}
        >
            <div style={innerStyles} className={classes.inner}>
                <div style={wrapperStyles}>{Video}</div>
            </div>
        </div>
    );
};

Video.propTypes = {
    classes: shape({
        root: string,
        inner: string,
        container: string,
        video: string
    }),
    url: string,
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
