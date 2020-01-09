import React, { useCallback } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';

import { useSection } from '@magento/peregrine/lib/talons/Accordion/useSection';

import Icon from '../Icon';

import { mergeClasses } from '../../classify';
import defaultClasses from './section.css';

const Section = props => {
    const {
        children,
        handleClick: handleClickExternal,
        index,
        isControlled,
        isOpen: isOpenExternal,
        title
    } = props;

    const talonProps = useSection({ isOpenExternal });
    const {
        handleClick: handleClickInternal,
        isOpen: isOpenInternal
    } = talonProps;

    const handleClickCallbackFn = isControlled
        ? handleClickExternal
        : handleClickInternal;
    const handleClick = useCallback(() => handleClickCallbackFn(index), [
        handleClickCallbackFn,
        index
    ]);
    const isOpen = isControlled ? isOpenExternal : isOpenInternal;

    const contents = isOpen ? children : null;
    const titleIconSrc = isOpen ? ArrowUp : ArrowDown;
    const titleIcon = <Icon src={titleIconSrc} />;

    const classes = mergeClasses(defaultClasses, props.classes);
    const titleContainerClass = isOpen
        ? classes.title_container_open
        : classes.title_container;

    return (
        <div>
            <button className={titleContainerClass} onClick={handleClick}>
                <div className={classes.title}>{title}</div>
                {titleIcon}
            </button>
            <div className={classes.contents_container}>{contents}</div>
        </div>
    );
};

export default Section;
