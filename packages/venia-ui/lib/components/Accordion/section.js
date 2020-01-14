import React, { useCallback } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';

import { useAccordionContext } from './accordion';
import Icon from '../Icon';

import { mergeClasses } from '../../classify';
import defaultClasses from './section.css';

const Section = props => {
    const { children, id, title } = props;

    const {
        handleSectionToggle,
        lastSectionId,
        openSections
    } = useAccordionContext();
    const isLast = lastSectionId === id;
    const isOpen = openSections.has(id);

    const handleSectionToggleWithId = useCallback(
        () => handleSectionToggle(id),
        [handleSectionToggle, id]
    );

    const contents = isOpen ? children : null;
    const titleIconSrc = isOpen ? ArrowUp : ArrowDown;
    const titleIcon = <Icon src={titleIconSrc} />;

    const classes = mergeClasses(defaultClasses, props.classes);
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
            <div className={classes.contents_container}>{contents}</div>
        </div>
    );
};

export default Section;
