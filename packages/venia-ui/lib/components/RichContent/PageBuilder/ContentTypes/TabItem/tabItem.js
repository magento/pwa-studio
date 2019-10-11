import React from 'react';
import { verticalAlignmentToFlex } from '../../utils';
import { resourceUrl } from '@magento/venia-drivers';

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
    const {
        minHeight,
        verticalAlignment,
        backgroundColor,
        desktopImage,
        mobileImage,
        backgroundSize,
        backgroundPosition,
        backgroundAttachment,
        backgroundRepeat,
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
        children
    } = props;

    let image = desktopImage;
    if (
        mobileImage &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(max-width: 768px)').matches
    ) {
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
        dynamicStyles.backgroundRepeat = backgroundRepeat
            ? 'repeat'
            : 'no-repeat';
    }

    if (verticalAlignment) {
        dynamicStyles.display = 'flex';
        dynamicStyles.justifyContent = verticalAlignmentToFlex(
            verticalAlignment
        );
        dynamicStyles.flexDirection = 'column';
    }

    return <div style={dynamicStyles}>{children}</div>;
};

export default TabItem;
