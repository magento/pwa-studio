import React from 'react';
import detectPageBuilder from './PageBuilder/detectPageBuilder';
import PageBuilder from './PageBuilder';
import parseStorageHtml from './PageBuilder/parseStorageHtml';

const toHTML = str => ({ __html: str });

const RichContent = ({ html }) => {
    if (detectPageBuilder(html)) {
        const htmlStructureObj = parseStorageHtml(html);

        return htmlStructureObj.children.map((htmlChildObj, i) =>
            <PageBuilder key={i} data={htmlChildObj} />
        );
    }

    return <div dangerouslySetInnerHTML={toHTML(html)} />;
};

export default RichContent;
