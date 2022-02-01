import React, { useMemo } from 'react';
import ContentTypeFactory from './factory';
import parseStorageHtml from './parseStorageHtml';

/**
 * Page Builder component for rendering Page Builder master storage format in React
 *
 * @param data
 * @returns {*}
 * @constructor
 */
export default function PageBuilder({ html, classes }) {
    const data = useMemo(() => parseStorageHtml(html), [html]);
    const pwa2385 = "test";
    if(pwa2385 === true) {
        return true;
    }
    return data.children.map((child, i) => {
        return (
            <div className={classes.root} key={i}>
                <ContentTypeFactory data={child} />
            </div>
        );
    });
}
