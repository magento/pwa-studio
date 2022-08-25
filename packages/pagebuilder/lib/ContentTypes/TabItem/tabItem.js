import React from 'react';
import { verticalAlignmentToFlex } from '../../utils';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useMediaQuery } from '@magento/peregrine/lib/hooks/useMediaQuery';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './tabItem.module.css';
import { arrayOf, oneOf, shape, string, object } from 'prop-types';

const { matchMedia } = globalThis;

/**
 * Page Builder TabItem component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef TabItem
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a TabItem.
 */
const TabItem = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        minHeight,
        verticalAlignment,
        backgroundColor,
        desktopImage,
        mobileImage,
        backgroundSize,
        backgroundPosition,
        backgroundAttachment,
        backgroundRepeat = 'repeat',
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        mediaQueries,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        children,
        cssClasses = []
    } = props;

    const { styles: mediaQueryStyles } = useMediaQuery({ mediaQueries });

    let image = desktopImage;
    if (mobileImage && matchMedia && matchMedia('(max-width: 768px)').matches) {
        image = mobileImage;
    }

    const dynamicStyles = {
        minHeight,
        verticalAlignment,
        backgroundColor,
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
        paddingLeft
    };

    if (image) {
        const resourceImage = resourceUrl(image, {
            type: 'image-wysiwyg',
            quality: 85
        });
        dynamicStyles.backgroundImage = `url(${resourceImage})`;
        dynamicStyles.backgroundSize = backgroundSize;
        dynamicStyles.backgroundPosition = backgroundPosition;
        dynamicStyles.backgroundAttachment = backgroundAttachment;
        dynamicStyles.backgroundRepeat = backgroundRepeat;
    }

    if (verticalAlignment) {
        dynamicStyles.display = 'flex';
        dynamicStyles.justifyContent = verticalAlignmentToFlex(
            verticalAlignment
        );
        dynamicStyles.flexDirection = 'column';
    }

    return (
        <div
            style={{ ...dynamicStyles, ...mediaQueryStyles }}
            className={[cssClasses, classes.root].join(' ')}
        >
            {children}
        </div>
    );
};

/**
 * Props for {@link TabItem}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the TabItem
 * @property {String} classes.root CSS class for the tab item root element
 * @property {String} tabName Name of the tab item
 * @property {String} verticalAlignment Vertical alignment of content within tab item
 * @property {String} minHeight CSS minimum height property
 * @property {String} backgroundColor CSS background-color property
 * @property {String} desktopImage Background image URL to be displayed on desktop devices
 * @property {String} mobileImage Background image URL to be displayed on mobile devices
 * @property {String} backgroundSize CSS background-size property
 * @property {String} backgroundPosition CSS background-position property
 * @property {String} backgroundAttachment CSS background-attachment property
 * @property {String} backgroundRepeat CSS background-repeat property
 * @property {String} textAlign Alignment of content within the tab item
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {Array} mediaQueries List of media query rules to be applied to the component
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
TabItem.propTypes = {
    classes: shape({
        root: string
    }),
    tabName: string,
    verticalAlignment: oneOf(['top', 'middle', 'bottom']),
    minHeight: string,
    backgroundColor: string,
    desktopImage: string,
    mobileImage: string,
    backgroundSize: string,
    backgroundPosition: string,
    backgroundAttachment: string,
    backgroundRepeat: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    mediaQueries: arrayOf(
        shape({
            media: string,
            style: object
        })
    ),
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default TabItem;
