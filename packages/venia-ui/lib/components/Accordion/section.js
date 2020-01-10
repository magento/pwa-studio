import React, { useCallback } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';

import Icon from '../Icon';

import { mergeClasses } from '../../classify';
import defaultClasses from './section.css';

const Section = props => {
    const { children, handleClick, index, isOpen, title } = props;

    const handleClickWithIndex = useCallback(() => handleClick(index), [
        handleClick,
        index
    ]);

    const contents = isOpen ? children : null;
    const titleIconSrc = isOpen ? ArrowUp : ArrowDown;
    const titleIcon = <Icon src={titleIconSrc} />;

    const classes = mergeClasses(defaultClasses, props.classes);
    const titleContainerClass = isOpen
        ? classes.title_container_open
        : classes.title_container;

    return (
        <div>
            <button
                className={titleContainerClass}
                onClick={handleClickWithIndex}
            >
                <div className={classes.title}>{title}</div>
                {titleIcon}
            </button>
            <div className={classes.contents_container}>{contents}</div>
        </div>
    );
};

export default Section;
