import React from 'react';
import detectPageBuilder from './PageBuilder/detectPageBuilder';
import PageBuilder from './PageBuilder';

const toHTML = str => ({ __html: str });

const RichContent = ({ html }) => {
    if (detectPageBuilder(html)) {
        return <PageBuilder masterFormat={html} />;
    }

    return <div dangerouslySetInnerHTML={toHTML(html)} />;
};

export default RichContent;
