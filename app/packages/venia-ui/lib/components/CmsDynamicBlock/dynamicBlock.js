import React from 'react';
import { shape, string } from 'prop-types';

import RichContent from '../RichContent';

/**
 * CMS Dynamic Block component.
 *
 * @typedef DynamicBlock
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a CMS Dynamic Block.
 */
const DynamicBlock = ({ content }) => <RichContent html={content.html} />;

/**
 * Props for {@link DynamicBlock}
 *
 * @typedef props
 *
 * @property {Object} content Content object of the Dynamic Block
 * @property {String} content.html Rich content of the Dynamic Block
 */
DynamicBlock.propTypes = {
    content: shape({
        html: string
    })
};

export default DynamicBlock;
