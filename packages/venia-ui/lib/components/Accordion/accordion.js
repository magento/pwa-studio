import React, { createContext, useContext } from 'react';

import { useAccordion } from '@magento/peregrine/lib/talons/Accordion/useAccordion';

import { mergeClasses } from '../../classify';
import defaultClasses from './accordion.css';

// To be controlled by the corresponding talon.
let contextValue = {
    handleSectionToggle: () => {},
    lastSectionId: '',
    openSections: new Set([])
};

const AccordionContext = createContext(contextValue);
const { Provider } = AccordionContext;

const Accordion = props => {
    const { canOpenMultiple = true, children } = props;

    // The talon is the source of truth for the context value.
    const talonProps = useAccordion({ canOpenMultiple, children });
    const { handleSectionToggle, lastSectionId, openSections } = talonProps;
    contextValue = {
        handleSectionToggle,
        lastSectionId,
        openSections
    };

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Provider value={contextValue}>
            <div className={classes.root}>{children}</div>
        </Provider>
    );
};

export default Accordion;

export const useAccordionContext = () => useContext(AccordionContext);
