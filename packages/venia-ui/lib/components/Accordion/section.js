import React, { useCallback } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';

import { useAccordionContext } from './accordion';
import Icon from '../Icon';

import { mergeClasses } from '../../classify';
import defaultClasses from './section.css';

const Section = props => {
    const { children, id, title } = props;

    const { handleSectionToggle, openSectionIds } = useAccordionContext();

    const handleSectionToggleWithId = useCallback(
        () => handleSectionToggle(id),
        [handleSectionToggle, id]
    );

    const isOpen = openSectionIds.has(id);
    const titleIconSrc = isOpen ? ArrowUp : ArrowDown;
    const titleIcon = <Icon src={titleIconSrc} />;

    const classes = mergeClasses(defaultClasses, props.classes);
    const contentsContainerClass = isOpen
        ? classes.contents_container
        : classes.contents_container_closed;
    const titleContainerClass = isOpen
        ? classes.title_container_open
        : classes.title_container;

    return (
        <div className={classes.root}>
            <button
                className={titleContainerClass}
                onClick={handleSectionToggleWithId}
            >
                <div className={classes.title}>{title}</div>
                {titleIcon}
            </button>
            <div className={contentsContainerClass}>{children}</div>
        </div>
    );
};

export default Section;
