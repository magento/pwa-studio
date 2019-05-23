import React, { useCallback, useRef, useState } from 'react';
import { node, shape, string } from 'prop-types';
import MoreVerticalIcon from 'react-feather/dist/icons/more-vertical';
import { useEventListener } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import Icon from 'src/components/Icon';

import defaultClasses from './kebab.css';

const Kebab = props => {
    const { children } = props;

    const kebabButtonRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const classes = mergeClasses(defaultClasses, props.classes);

    const handleDocumentClick = useCallback(
        event => {
            const shouldBeOpen = kebabButtonRef.current.contains(event.target);
            setIsOpen(shouldBeOpen);
        },
        [kebabButtonRef, setIsOpen]
    );

    useEventListener(document, 'mousedown', handleDocumentClick);
    useEventListener(document, 'touchend', handleDocumentClick);

    const toggleClass = isOpen ? classes.dropdown_active : classes.dropdown;

    return (
        <div className={classes.root}>
            <button className={classes.kebab} ref={kebabButtonRef}>
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
