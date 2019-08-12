import React, { useEffect } from 'react';
import { HeadProvider } from 'react-head';

const filterOutTitleTags = titleTags => {
    titleTags.forEach(titleTag => {
        if (titleTag) titleTag.parentNode.removeChild(titleTag);
    });
};

const VeniaHeadProvider = props => {
    useEffect(() => {
        const titleTagsToRemove = document.getElementsByTagName('title');
        filterOutTitleTags([...titleTagsToRemove]);
    }, []);

    return <HeadProvider>{props.children}</HeadProvider>;
};

export default VeniaHeadProvider;
