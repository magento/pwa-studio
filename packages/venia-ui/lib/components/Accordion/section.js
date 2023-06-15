import React, { useCallback } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';

import { useAccordionContext } from './accordion';
import Icon from '../Icon';

import { useStyle } from '../../classify';
import defaultClasses from './section.module.css';

const Section = props => {
    const { children, id, title, ...restProps } = props;

    // Remove isOpen from restProps to avoid having it in the root container
    delete restProps.isOpen;

    const { handleSectionToggle, openSectionIds } = useAccordionContext();

    const handleSectionToggleWithId = useCallback(
        () => handleSectionToggle(id),
        [handleSectionToggle, id]
    );

    const isOpen = openSectionIds.has(id);
    const titleIconSrc = isOpen ? ArrowUp : ArrowDown;
    const titleIcon = <Icon src={titleIconSrc} size={24} />;

    const classes = useStyle(defaultClasses, props.classes);
    const contentsContainerClass = isOpen
        ? classes.contents_container
        : classes.contents_container_closed;

    return (
        <div className={classes.root} {...restProps}>
            <button
                aria-expanded={isOpen}
                className={classes.title_container}
                data-cy="Section-titleContainer"
                onClick={handleSectionToggleWithId}
                type="button"
            >
                <span className={classes.title_wrapper}>
                    <span className={classes.title}>{title}</span>
                    {titleIcon}
                </span>
            </button>
            <div className={contentsContainerClass}>{children}</div>
        </div>
    );
};

export default Section;
