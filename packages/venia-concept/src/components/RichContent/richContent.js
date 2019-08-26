import React  from 'react';
import detectPageBuilder from "./PageBuilder/detectPageBuilder";
import PageBuilder from "./PageBuilder";
import parseStorageHtml from "./PageBuilder/parseStorageHtml";

const toHTML = str => ({ __html: str });

const RichContent = ({ html }) => {
    if (detectPageBuilder(html)) {
        return <PageBuilder data={parseStorageHtml(html)} />;
    }

    return <div dangerouslySetInnerHTML={toHTML(html)} />;
};

export default RichContent;
