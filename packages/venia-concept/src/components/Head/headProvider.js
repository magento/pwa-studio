import React, { useEffect } from 'react';
import { HeadProvider as _HeadProvider } from 'react-head';

const filterOutTitleTags = titleTags => {
    titleTags.forEach(titleTag => {
        if (titleTag) titleTag.parentNode.removeChild(titleTag);
    });
};

const HeadProvider = props => {
    useEffect(() => {
        const titleTagsToRemove = document.getElementsByTagName('title');
        filterOutTitleTags([...titleTagsToRemove]);
    }, []);

    return <_HeadProvider>{props.children}</_HeadProvider>;
};

export default HeadProvider;
