import React, { createContext, useContext } from 'react';

import { useAccordion } from '@magento/peregrine/lib/talons/Accordion/useAccordion';

import { useStyle } from '../../classify';
import defaultClasses from './accordion.module.css';

const AccordionContext = createContext();
const { Provider } = AccordionContext;

const Accordion = props => {
    const { canOpenMultiple = true, children } = props;

    // The talon is the source of truth for the context value.
    const talonProps = useAccordion({ canOpenMultiple, children });
    const { handleSectionToggle, openSectionIds } = talonProps;
    const contextValue = {
        handleSectionToggle,
        openSectionIds
    };

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Provider value={contextValue}>
            <div className={classes.root}>{children}</div>
        </Provider>
    );
};

export default Accordion;

export const useAccordionContext = () => useContext(AccordionContext);
