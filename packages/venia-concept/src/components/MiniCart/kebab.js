import React, { useCallback, useRef, useState } from 'react';
import { node, shape, string } from 'prop-types';
import MoreVerticalIcon from 'react-feather/dist/icons/more-vertical';

import { useEventListener } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import Icon from 'src/components/Icon';

import defaultClasses from './kebab.css';

const Kebab = props => {
    const { children } = props;

    const kebabRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const classes = mergeClasses(defaultClasses, props.classes);
    const toggleClass = isOpen ? classes.dropdown_active : classes.dropdown;

    const handleKebabClick = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);
    const handleOutsideKebabClick = useCallback(event => {
        // Ensure we're truly outside of the kebab.
        if (!kebabRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEventListener(document, 'mousedown', handleOutsideKebabClick);
    useEventListener(document, 'touchend', handleOutsideKebabClick);

    return (
        <div className={classes.root}>
            <button
                className={classes.kebab}
                onClick={handleKebabClick}
                ref={kebabRef}
            >
                <Icon src={MoreVerticalIcon} />
            </button>
            <ul className={toggleClass}>{children}</ul>
        </div>
    );
};

Kebab.propTypes = {
    children: node,
    classes: shape({
        dropdown: string,
        dropdown_active: string,
        kebab: string,
        root: string
    })
};

export default Kebab;
