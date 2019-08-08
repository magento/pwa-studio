import React, { useEffect } from 'react';
import { HeadProvider as _HeadProvider } from 'react-head';

const filterOutTitleTags = titleTags => {
    titleTags
        .filter(titleNode => !titleNode.dataset.synthetictag)
        .forEach(titleTag => {
            if (titleTag) titleTag.parentNode.removeChild(titleTag);
        });
};

export default props => {
    useEffect(() => {
        const titleTagsToRemove = document.getElementsByTagName('title');
        filterOutTitleTags([...titleTagsToRemove]);
    }, []);

    return <_HeadProvider>{props.children}</_HeadProvider>;
};
