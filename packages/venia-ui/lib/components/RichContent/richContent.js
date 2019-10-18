import React from 'react';
import detectPageBuilder from './PageBuilder/detectPageBuilder';
import PageBuilder from './PageBuilder';
import { mergeClasses } from '../../classify';
import defaultClasses from './richContent.css';
import { shape, string } from 'prop-types';

const toHTML = str => ({ __html: str });

/**
 * RichContent component.
 *
 * This component serves as the pool to determine which type of content is being rendered
 * and pass the data off to the correct system.
 *
 * @typedef RichContent
 * @kind functional component
 *
 * @param {Object} props React component props
 *
 * @returns {React.Element} A React component that renders Heading with optional styling properties.
 */
const RichContent = props => {
    const { html } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    if (detectPageBuilder(html)) {
        return (
            <div className={classes.root}>
                <PageBuilder masterFormat={html} />
            </div>
        );
    }

    return (
        <div className={classes.root} dangerouslySetInnerHTML={toHTML(html)} />
    );
};

/**
 * Props for {@link RichContent}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the RichContent
 * @property {String} classes.root CSS class for the root container element
 * @property {String} html Content
 */
RichContent.propTypes = {
    classes: shape({
        root: string
    }),
    html: string
};

export default RichContent;
