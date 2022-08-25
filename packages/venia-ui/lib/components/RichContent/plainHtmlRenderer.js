import React from 'react';
import htmlStringImgUrlConverter from '@magento/peregrine/lib/util/htmlStringImgUrlConverter';

const toHTML = str => ({ __html: htmlStringImgUrlConverter(str) });

function PlainHtmlRenderer({ html, classes }) {
    // Even if empty, render a div with no content, for styling purposes.
    if (!html) {
        return <div className={classes.root} />;
    }
    return (
        <div className={classes.root} dangerouslySetInnerHTML={toHTML(html)} />
    );
}

export const canRender = () => true; // backstop component, always renders
export const Component = PlainHtmlRenderer;
