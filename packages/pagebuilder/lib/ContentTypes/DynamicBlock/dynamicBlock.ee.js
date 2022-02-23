import React from 'react';
import { arrayOf, bool, oneOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsDynamicBlockGroup, {
    DISPLAY_MODE_FIXED_TYPE,
    DISPLAY_MODE_SALES_RULE_TYPE,
    DISPLAY_MODE_CATALOG_RULE_TYPE
} from '@magento/venia-ui/lib/components/CmsDynamicBlock';
import defaultClasses from './dynamicBlock.module.css';

/**
 * Page Builder Dynamic Block component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef DynamicBlock
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Dynamic Block.
 */
const DynamicBlock = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        displayInline,
        displayMode,
        uids = '',
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        minHeight,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const dynamicStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        minHeight,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const RootTag = displayInline ? 'span' : 'div';

    // If no uids are found, do not render
    if (!uids || (uids && uids.length === 0)) {
        return null;
    }

    return (
        <RootTag
            style={dynamicStyles}
            className={[classes.root, ...cssClasses].join(' ')}
            aria-live="polite"
            aria-busy="false"
        >
            <CmsDynamicBlockGroup displayMode={displayMode} uids={uids} />
        </RootTag>
    );
};

/**
 * Props for {@link DynamicBlock}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the component
 * @property {String} classes.root CSS class for the component root element
 * @property {Boolean} displayInline Select display inline or display block
 * @property {String} displayMode Display mode of the dynamic block
 * @property {String} uids ID of the dynamic block
 * @property {String} textAlign Alignment of the component within the parent container
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
DynamicBlock.propTypes = {
    classes: shape({
        root: string
    }),
    displayInline: bool,
    displayMode: oneOf([
        DISPLAY_MODE_FIXED_TYPE,
        DISPLAY_MODE_SALES_RULE_TYPE,
        DISPLAY_MODE_CATALOG_RULE_TYPE
    ]),
    uids: string,
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

export default DynamicBlock;
