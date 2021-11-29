import React from 'react';
import { arrayOf, oneOf, string } from 'prop-types';

import CmsDynamicBlockGroup from '@magento/venia-ui/lib/components/CmsDynamicBlock/cmsDynamicBlock';

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
    const {
        displayMode,
        uids,
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
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    return (
        <div style={dynamicStyles} className={cssClasses.join(' ')}>
            <CmsDynamicBlockGroup displayMode={displayMode} uids={uids} />
        </div>
    );
};

/**
 * Props for {@link DynamicBlock}
 *
 * @typedef props
 *
 * @property {String} displayMode Display mode of the dynamic block
 * @property {String} uids ID of the dynamic block
 * @property {String} textAlign Alignment of the dynamic block within the parent container
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
    displayMode: oneOf(['fixed', 'salesrule', 'catalogrule']),
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
